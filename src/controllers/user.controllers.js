import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { User } from "../models/user.model.js";
import { uploadToCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/apiResponse.js";

const registerUser = asyncHandler(async (req, res) => {
  const { fullName, email, userName, password } = req.body;
  // if (fullName === "") {
  //   throw new ApiError(400, "Full name is required");
  // }

  // get user detail from frontend
  // validation - non empty
  if (
    [fullName, email, userName, password].some((field) => field?.trim() === "")
  ) {
    throw new ApiError(400, "All fields are required");
  }
  // check user already exists: username, email
  if (await User.findOne({ $or: [{ email }, { userName }] })) {
    throw new ApiError(409, "Email or Username already exists");
  }

  // check for images, check for avatar
  const avatarLocalPath = req.files?.avatar[0]?.path;
  //const coverImageLocalPath = req.files?.coverImage[0]?.path;
  if (
    req.files &&
    Array.isArray(req.files?.coverImage) &&
    req.files?.coverImage.length > 0
  ) {
    var coverImageLocalPath = req.files?.coverImage[0]?.path;
  }
  if (!avatarLocalPath) {
    throw new ApiError(400, "Avatar is required");
  }

  // upload them to cloundinary, avatar
  const avatar = await uploadToCloudinary(avatarLocalPath);
  const coverImage = await uploadToCloudinary(coverImageLocalPath);
  if (!avatar) {
    throw new ApiError(400, "Avatar is required");
  }

  // create user object - create entry in db
  const user = await User.create({
    fullName,
    email,
    userName: userName.toLowerCase(),
    password,
    avatar: avatar.url,
    coverImage: coverImage?.url || "",
  });

  // remove password and refresh token from user object response
  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );
  // check for user created successfully or not
  if (!createdUser) {
    throw new ApiError(500, "User not created, please try again");
  }
  // send response
  return res
    .status(201)
    .json(new ApiResponse(200, createdUser, "User created successfully"));
});

export { registerUser };
