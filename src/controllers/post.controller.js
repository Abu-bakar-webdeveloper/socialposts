import mongoose from 'mongoose';
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import PostModel from "../models/post.model.js";
import { uploadOnCloudinary, deleteFromCloudinary } from "../utils/cloudinary.js";

const createPost = asyncHandler(async (req, res) => {
  const { desc } = req.body;
  const userId = req.user._id; // Ensure userId is sent in the request body


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
    user: userId,
    desc,
    image: image.url,
  });

  return res
    .status(201)
    .json(new ApiResponse(200, post, "Post uploaded successfully"));
});


// ... (previous functions remain unchanged)

const updatePost = asyncHandler(async (req, res) => {
  const { postId } = req.params;
  const { desc } = req.body;
  const userId = req.user._id;

  if (!mongoose.Types.ObjectId.isValid(postId)) {
    throw new ApiError(400, "Invalid post ID");
  }

  // Check if the post exists and belongs to the user
  const existingPost = await PostModel.findOne({ _id: postId, user: userId });
  if (!existingPost) {
    throw new ApiError(404, "Post not found or you don't have permission to update it");
  }

  // Prepare the update object
  const updateData = {};

  // Update description if provided
  if (desc !== undefined) {
    updateData.desc = desc;
  }

  // Handle image update if a new file is provided
  if (req.file) {
    const imageLocalPath = req.file.path;
    const newImage = await uploadOnCloudinary(imageLocalPath);

    if (!newImage) {
      throw new ApiError(500, "Image upload failed");
    }

    // Delete the old image from Cloudinary
    if (existingPost.image) {
      const publicId = existingPost.image.split('/').pop().split('.')[0];
      await deleteFromCloudinary(publicId);
    }

    updateData.image = newImage.url;
  }

  // Only proceed with update if there are changes
  if (Object.keys(updateData).length > 0) {
    const updatedPost = await PostModel.findByIdAndUpdate(
      postId,
      updateData,
      { new: true, runValidators: true }
    );

    return res
      .status(200)
      .json(new ApiResponse(200, updatedPost, "Post updated successfully"));
  } else {
    // If no updates were provided
    return res
      .status(200)
      .json(new ApiResponse(200, existingPost, "No changes made to the post"));
  }
});

const getPost = asyncHandler(async (req, res) => {
  const { postId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(postId)) {
    throw new ApiError(400, "Invalid post ID");
  }

  const post = await PostModel.findById(postId);

  if (!post) {
    throw new ApiError(404, "Post not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, post, "Post retrieved successfully"));
});

// ... (remaining functions unchanged)

export { createPost, updatePost, getPost};
