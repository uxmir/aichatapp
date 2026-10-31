import ApiError from "../../common/utils/response.error.js";
import ApiResponse from "../../common/utils/response.success.js";
import  AuthService from "./auth.service.js";
const signup = async (req, res) => {
  const user = await AuthService.signup(req.body);
  if (!user) throw ApiError.badRequest("user is not created");
  ApiResponse.created(res, "user is created", user);
};
const verifyEmail = async (req, res) => {
  await AuthService.verifyEmail(req.params.token);
  ApiResponse.ok(res, "user is verified");
};
const login = async (req, res) => {
  const { user, accessToken, refreshToken } = await AuthService.login(req.body);
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });
  ApiResponse.ok(res, "user logged in", { user, accessToken });
};
const refreshToken = async (req, res) => {
  const token = req.cookies?.refreshToken;
  const { accessToken } = await AuthService.refresh(token);
  ApiResponse.ok(res, "accessToken has been generated", { accessToken });
};
const logout = async (req, res) => {
  await AuthService.logout(req.user?.id);
  res.clearCookie("refreshToken");
  ApiResponse.ok(res, "user logged out");
};
const forgotPassword = async (req, res) => {
  await AuthService.forgotPassword(req.body.email);
  ApiResponse.ok(res, "password restored");
};
const resetPassword = async (req, res) => {
  await AuthService.updatePassword(req.params.token, req.body.password);
  ApiResponse.ok(res, "password is updated");
};

const googleAuth = async (req, res) => {
  const { accessToken, refreshToken } = req.user;
  res.cookie("refreshToken", refreshToken, {
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });
  res.redirect(`${process.env.CLIENT_URL}/login-success?token=${accessToken}`);
};
export  {
  signup,
  login,
  logout,
  forgotPassword,
  resetPassword,
  refreshToken,
  verifyEmail,
  googleAuth
};
