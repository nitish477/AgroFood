import { asyncHandler } from "./../util/asyncHandler.js";
import { ApiResponse } from "./../util/Apiresponce.js";
import { ApiError } from "../util/apiErr.js";
import { User } from "../modals/USer.modal.js";

const generateAccessAndRefreshTokens = async (userId) => {
  try {
    const user = await User.findById(userId);
    const accessToken = await user.generateAccessToken();
    const refreshToken = await user.generateRefreshToken();
    // console.log("accessToken----->", accessToken);
    // console.log("refreshToken----->", refreshToken);
    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });
    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(
      500,
      "Something went wrong while generating refresh and access token"
    );
  }
};

// Register User
const registerUser = asyncHandler(async (req, res) => {
  const { fullName, email, password, roles } = req.body;

  if ([fullName, password, email].some(field => !field || field.trim() === "")) {
    throw new ApiError(400, "All fields are required");
  }

  // Check if roles is provided as a string and convert it to an array
  if (!roles || roles.trim() === "") {
    throw new ApiError(400, "Role is required");
  }

  // Check if a user with the same email already exists (for any role)
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new ApiError(400, "Email already exists");
  }


  const user = await User.create({
    fullName,
    email,
    password,
    roles, 
  });

  const createdUser = await User.findById(user._id).select("-password -refreshToken");
  if (!createdUser) {
    throw new ApiError(500, "Something went wrong while registering user");
  }

  return res
    .status(201)
    .json(new ApiResponse(200, createdUser, "User Registered Successfully"));
});
// Login User
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new ApiError(400, "Email and password are required");
  }

  const user = await User.findOne({ email });
  if (!user || !(await user.isPasswordCorrect(password))) {
    throw new ApiError(401, "Invalid email or password");
  }

  const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(user._id);
  const loggedInUser = await User.findById(user._id).select("-password -refreshToken");

  res
    .status(200)
    .cookie("accessToken", accessToken, { httpOnly: true, secure: true })
    .cookie("refreshToken", refreshToken, { httpOnly: true, secure: true })
    .json(new ApiResponse(200, { user: loggedInUser, accessToken, refreshToken }, "User logged in successfully"));
});



const logoutUser = asyncHandler(async (req, res) => {
  User.findByIdAndUpdate(
    req.user._id,
    {
      $unset: {
        refreshToken: 1,
      },
    },
    {
      new: true,
    }
  );
  const option = {
    httpOnly: true,
    secure: true,
  };
  return res
    .status(200)
    .clearCookie("accessToken", option)
    .clearCookie("refreshToken", option)
    .json(new ApiResponse(200, {}, "User Logged Out"));
});





export { registerUser, loginUser , logoutUser};