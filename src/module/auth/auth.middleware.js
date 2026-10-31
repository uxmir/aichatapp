import { verifyAccessToken } from "../../common/utils/jwt.js";
import ApiError from "../../common/utils/response.error.js";
import User from "./auth.model.js";
const authenticate = async (req, res, next) => {
  try {
    let token;
    if (req.headers.authorization.startsWith("Bearer")) {
      token = req.headers.authorization.split(" ")[1];
    }
    if (!token) throw ApiError.unauthorized("user is unauthorized");
    const decoded = verifyAccessToken(token);
    const user = await User.findById(decoded?.id);
    if (!user) throw ApiError.notFound("user id is not found");
    req.user = {
      id: user?._id,
      name: user?.name,
      email: user?.email,
      role: user?.role,
    };
    next();
  } catch (error) {
    throw ApiError(error.message);
  }
};

const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user?.role))
      throw ApiError.forbidden("yo have no permission to take this role");
        next()
  };
};

export  { authenticate, authorize };
