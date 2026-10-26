import jwt from "jsonwebtoken";
import crypto from "crypto";
const generateResetToken = () => {
  const rawToken = crypto.randomBytes(32).toString("hex");
  const hashedToken = crypto
    .createHash("sha256")
    .update(rawToken)
    .digest("hex")
  return {
    rawToken,
    hashedToken,
  };
};

const generateAccessToken = async (payload) => {
  const token = jwt.sign(payload, process.env.JWT_ACCESS_SECRET, {
    expiresIn: process.env.JWT_ACCESS_EXPIRES_IN || '15m',
  });
  return token;
};
const verifyAccessToken = async (payload) => {
  const token = jwt.verify(payload, process.env.JWT_ACCESS_SECRET);
  return token;
};
const generateRefreshToken = async (payload) => {
  const token = jwt.sign(payload, process.env.JWT_REFRESH_SECRET, {
    expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
  });
  return token;
};
const verifyRefreshToken = async (payload) => {
  const token = jwt.verify(payload, process.env.JWT_REFRESH_SECRET);
  return token;
};
export {
  generateResetToken,
  generateAccessToken,
  verifyAccessToken,
  generateRefreshToken,
  verifyRefreshToken
};
