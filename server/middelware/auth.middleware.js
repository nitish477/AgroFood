import { ApiError } from "../util/apiErr.js";
import { asyncHandler } from "../util/asyncHandler.js";
import Jwt from "jsonwebtoken";
import { User } from "../modals/USer.modal.js";
import { config } from "../config/config.js";

export const verifyJwt = asyncHandler(async (req, res, next) => {
  try {
    const token =
      req.cookies?.accessToken ||
      req.header("Authorization")?.replace("Bearer ", "").trim();
    
    if (!token) {
      return res
        .status(401)
        .json({ message: "Unauthorized: please log in to access" });
    }


    const decodedToken = Jwt.verify(token, config.jwtAccessSecret);

    const user = await User.findById(decodedToken?._id).select(
      "-password -refreshToken"
    );
    
    if (!user) {
      throw new ApiError(401, "Invalid Access Token");
    }
    
    req.user = user;
    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      throw new ApiError(401, "Access Token has expired");
    } else if (error.name === "JsonWebTokenError") {
      throw new ApiError(401, "Invalid Access Token");
    } else {
      throw new ApiError(401, error.message || "Unauthorized");
    }
  }
});