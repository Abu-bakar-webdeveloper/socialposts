import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import PostModel from "../models/post.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

const createPost = asyncHandler(async (req, res) => {
  const { desc } = req.body; // Ensure userId is sent in the request body


  const imageLocalPath = req.file?.path;

  if (!imageLocalPath) {
    throw new ApiError(400, "imagepath is required");
  }

  const image = await uploadOnCloudinary(imageLocalPath);

  if (!image) {
    throw new ApiError(400, "Image upload failed");
  }

  // Create the post, including the userId
  const post = await PostModel.create({
    desc,
    image: image.url,
  });

  return res
    .status(201)
    .json(new ApiResponse(200, post, "Post uploaded successfully"));
});

export { createPost };
