import {  verifyRefreshToken } from "../../common/utils/jwt.js";
import ApiError from "../../common/utils/response.error.js";
import User from "./auth.model.js";

const authenticate = async (req, res, next) => {
  try {
    let token;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }  else if (req.cookies && req.cookies.refreshToken) {
      token = req.cookies.refreshToken;
    }

    if (!token) {
      throw ApiError.unauthorized("User is unauthorized");
    }

    const decoded =await verifyRefreshToken(token);
    const user = await User.findById(decoded?.id);

    if (!user) {
      throw ApiError.notFound("User id is not found");
    }

    req.user = {
      _id: user?._id,
      id: user?._id,
      name: user?.name,
      email: user?.email,
      role: user?.role,
    };

    next();
  } catch (error) {
    return next(ApiError.serverError(error.message));
  }
};

const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user?.role)) {
      return next(
        ApiError.forbidden("You have no permission to take this role"),
      );
    }
    next();
  };
};

export { authenticate, authorize };
