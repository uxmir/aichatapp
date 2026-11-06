
import ApiResponse from "../../common/utils/response.success.js";
import  AuthService from "./auth.service.js";
const googleAuth = async (req, res) => {
  try {
    const { accessToken, refreshToken } = req.user;

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax", 
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });
    return res.redirect(`${process.env.CLIENT_URL}/login-success?token=${accessToken}`);
  } catch (error) {
    return res.redirect(`${process.env.CLIENT_URL}/login?error=auth_failed`);
  }
};
const refreshToken = async (req, res) => {
  const token = req.cookies?.refreshToken;
  const { accessToken } = await AuthService.refresh(token);
  ApiResponse.ok(res, "accessToken has been generated", { accessToken });
};
const logout = async (req, res) => {
  await AuthService.logout();
  res.clearCookie("refreshToken");
  ApiResponse.ok(res, "user logged out");
};
const findMe=async(req,res)=>{
  const result=await AuthService.getMe(req.user._id)
  ApiResponse.ok(res,"user is found",result)
}
export  {
  googleAuth,
  refreshToken,
  logout,
  findMe
};
