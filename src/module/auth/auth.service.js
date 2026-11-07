
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
    const decodedRefresh = await verifyRefreshToken(refreshToken);

console.log("========== LOGIN REFRESH DEBUG ==========");
console.log(
  "Token preview:",
  `${refreshToken.slice(0, 8)}...${refreshToken.slice(-8)}`
);
console.log("Decoded refresh:", decodedRefresh);
console.log("Decoded ID:", decodedRefresh?.id);
console.log("Decoded role:", decodedRefresh?.role);
console.log("==========================================");

user.refreshToken = hashToken(refreshToken);
await user.save();
    user.refreshToken = hashToken(refreshToken);
    await user.save();
    return {
      user,
      accessToken,
      refreshToken,
    };
  } catch (error) {
    throw ApiError.serverError(`google auth is not working  ${error?.message}`);
  }
};
// const refresh = async (token) => {
//   try {
//     if (!token) throw ApiError.unauthorized("token is invalid");
//     const decoded = verifyRefreshToken(token);
//     const user = await User.findById(decoded.id).select("+refreshToken");
//     if (!user) throw ApiError.unauthorized("token is not matching");
//     if (user.refreshToken !== hashToken(token))
//       throw ApiError.unauthorized("token is not matching with refresh token");
//     const accessToken = generateAccessToken({
//       id: user?._id,
//       role: user?.role,
//     });
//     return { accessToken };
//   } catch (error) {
//     if (error.statusCode) {
//       throw error;
//     }
//     throw ApiError.serverError(`Internal server error: ${error.message}`);
//   }
// };
const refresh = async (token) => {
  try {
    console.log("\n========== REFRESH DEBUG START ==========");

    console.log("1. Cookie refresh token exists:", !!token);
    console.log("2. Cookie token length:", token?.length);

    if (token) {
      console.log(
        "3. Cookie token preview:",
        `${token.slice(0, 8)}...${token.slice(-8)}`
      );
    }

    if (!token) {
      throw ApiError.unauthorized("token is invalid");
    }

    const decoded = await verifyRefreshToken(token);

    console.log("4. Decoded token user id:", decoded?.id);
    console.log("5. Decoded token role:", decoded?.role);

    const user = await User.findById(decoded.id).select("+refreshToken");

    console.log("6. User found:", !!user);
    console.log("7. DB refresh hash exists:", !!user?.refreshToken);

    if (!user) {
      throw ApiError.unauthorized("token is not matching");
    }

    const incomingTokenHash = hashToken(token);

    console.log("8. Incoming token hash:", incomingTokenHash);
    console.log("9. DB stored hash:", user.refreshToken);

    console.log(
      "10. HASH MATCH:",
      user.refreshToken === incomingTokenHash
    );

    if (user.refreshToken !== incomingTokenHash) {
      console.log("❌ REFRESH TOKEN MISMATCH");
      console.log("========== REFRESH DEBUG END ==========\n");

      throw ApiError.unauthorized(
        "token is not matching with refresh token"
      );
    }

    console.log("✅ REFRESH TOKEN MATCHED");

    const accessToken = generateAccessToken({
      id: user._id,
      role: user.role,
    });

    console.log("11. New access token generated:", !!accessToken);
    console.log("========== REFRESH DEBUG END ==========\n");

    return { accessToken };

  } catch (error) {
    console.log("❌ REFRESH ERROR:", error.message);

    if (error.statusCode) {
      throw error;
    }

    throw ApiError.serverError(
      `Internal server error: ${error.message}`
    );
  }
};
const logout = async (userId) => {
  try {
    await User.findByIdAndUpdate(userId, { refreshToken: null });
  } catch (error) {
    throw ApiError.serverError(`internal server error${error.message}`);
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
