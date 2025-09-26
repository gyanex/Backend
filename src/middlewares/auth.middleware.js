import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";

export const verifyJWT = asyncHandler(async (req, _, next) => {
  try {
    const token =
      req.cookies?.accessToken || req.headers.authorization?.split(" ")[1];
    if (!token) {
      throw new ApiError(401, "Unauthorized, token not found");
    }
    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    const user = await User.findById(decodedToken._Id).select(
      "-password -refreshToken"
    );
    if (!user) {
      new ApiError(401, "Unauthorized, user not found");
    }
    req.user = user;
    next();
  } catch (error) {
    new ApiError(401, error?.message || "Unauthorized, user not found");
  }
});
