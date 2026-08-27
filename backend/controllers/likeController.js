import Like from "../models/likeModel.js";
import Video from "../models/videoModel.js";
import { successResponse, errorResponse } from "../utils/response.js";



// Like or dislike a video
export const likeVideo = async (req, res) => {
  try {
    // Get video ID from URL
    const { id } = req.params;

    // Get like/dislike value from request body
    // true = Like
    // false = Dislike
    const { isLike } = req.body;

    // Make sure isLike is actually true or false
    if (typeof isLike !== "boolean") {
      return errorResponse(res, 400, "isLike must be true or false");
    }

    // Check whether video exists
    const video = await Video.findById(id);

    // Return error if video does not exist
    if (!video) {
      return errorResponse(res, 404, "Video not found");
    }

    // Check whether this user already reacted to this video
    const existingLike = await Like.findOne({
      user: req.user._id,
      video: id,
    });

    // If reaction already exists, update Like to Dislike
    // or Dislike to Like
    if (existingLike) {
      existingLike.isLike = isLike;

      // Save the updated reaction
      await existingLike.save();

      // Return updated reaction
      return successResponse(
        res,
        200,
        "Like/dislike updated successfully",
        existingLike,
      );
    }

    // Create a new Like/Dislike record
    const like = await Like.create({
      user: req.user._id,
      video: id,
      isLike,
    });

    // Return newly created reaction
    return successResponse(res, 201, "Like/dislike added successfully", like);
  } catch (error) {
    // Log error for debugging
    console.error("Like video error:", error);

    // Send error response
    return errorResponse(res, 500, "Failed to like/dislike video");
  }
};



// Get like/dislike count and current user's reaction
export const getLikeDislikeCount = async (req, res) => {
  try {
    // Get video ID from URL
    const { id } = req.params;

    // Find the video
    const video = await Video.findById(id);

    // Check whether video exists
    if (!video) {
      return errorResponse(res, 404, "Video not found");
    }

    // Count total likes
    const likes = await Like.countDocuments({
      video: id,
      isLike: true,
    });

    // Count total dislikes
    const dislikes = await Like.countDocuments({
      video: id,
      isLike: false,
    });

    // Default reaction for a user who is not logged in
    let userReaction = null;

    // Check current user's reaction only if user is logged in
    if (req.user) {
      const existingLike = await Like.findOne({
        user: req.user._id,
        video: id,
      });

      // If user has reacted
      if (existingLike) {
        userReaction = existingLike.isLike;
      }
    }

    // Send counts and current user's reaction
    return successResponse(
      res,
      200,
      "Like/dislike count fetched successfully",
      {
        likes,
        dislikes,
        userReaction,
      },
    );
  } catch (error) {
    // Print error for debugging
    console.error(
      "Get like/dislike count error:",
      error,
    );

    // Send error response
    return errorResponse(
      res,
      500,
      "Failed to get like/dislike count",
    );
  }
};