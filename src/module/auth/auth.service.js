
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} from "../../common/utils/jwt.js";
import ApiError from "../../common/utils/response.error.js";
import User from "./auth.model.js";
import crypto from "crypto";

const hashToken = (token) =>
  crypto.createHash("sha256").update(token).digest("hex");
// google login
const googleLogin = async (profile) => {
  try {
    let user = await User.findOne({
      $or: [{ googleId: profile?.id }, { email: profile?.emails[0].value }],
    });
    if (!user) {
      user = await User.create({
        googleId: profile?.id,
        name: profile?.displayName,
        email: profile?.emails[0].value,
        isVerified: true,
        role: "user",
      });
    } else if (!user?.googleId) {
      user.googleId = profile?.id;
      await user.save();
    }
    const accessToken = await generateAccessToken({
      id: user?._id,
      role: user?.role,
    });
    const refreshToken = await generateRefreshToken({
      id: user?._id,
      role: user?.role,
    });
    user.refreshToken = hashToken(refreshToken);
    await user.save();
    return {
      user,
      accessToken,
      refreshToken,
    };
  } catch (error) {
    throw ApiError.badRequest(`google auth is not working  ${error?.message}`);
  }
};
const refresh = async (token) => {
  try {
    if (!token) throw ApiError.unauthorized("token is invalid");
    const decoded = verifyRefreshToken(token);
    const user = await User.findById(decoded.id).select("+refreshToken");
    if (!user) throw ApiError.unauthorized("token is not matching");
    if (user.refreshToken !== hashToken(token))
      throw ApiError.unauthorized("token is not matching with refresh token");
    const accessToken = generateAccessToken({
      id: user?._id,
      role: user?.role,
    });
    return { accessToken };
  } catch (error) {
    throw ApiError.badRequest(`internal server error${error.message}`);
  }
};
const logout = async (userId) => {
  try {
    await User.findByIdAndUpdate(userId, { refreshToken: null });
  } catch (error) {
    throw ApiError.badRequest(`internal server error${error.message}`);
  }
};

const getMe=async(userId)=>{
try {
  if(!userId) throw ApiError.unauthorized("user is not found");
const user=await User.findById(userId);
return user;
} catch (error) {
  throw ApiError.serverError(`internal server error${error.message}`)
}
}
export default {
  googleLogin,
   refresh,
  logout,
  getMe
};
