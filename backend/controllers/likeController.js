import Like from "../models/likeModel.js";
import Video from "../models/videoModel.js";
import { successResponse, errorResponse } from "../utils/response.js";

// Like or dislike a video
export const likeVideo = async (req, res) => {
  try {
    // Get video ID from URL
    const { id } = req.params;

    // Get like/dislike value from request body
    const { isLike } = req.body;

    // Check whether video exists
    const video = await Video.findById(id);

    if (!video) {
      return errorResponse(res, 404, "Video not found");
    }

    // Check whether user has already liked/disliked this video
    const existingLike = await Like.findOne({
      user: req.user._id,
      video: id,
    });

    console.log("existingLike",existingLike);
    

    // If already exists, update it
    if (existingLike) {
      existingLike.isLike = isLike;
      await existingLike.save();

      return successResponse(
        res,
        200,
        "Like/dislike updated successfully",
        existingLike,
      );
    }

    // Create new like/dislike
    const like = await Like.create({
      user: req.user._id,
      video: id,
      isLike,
    });

    return successResponse(res, 201, "Like/dislike added successfully", like);
  } catch (error) {
    console.error("Like video error:", error);

    return errorResponse(res, 500, "Failed to like/dislike video");
  }
};




// Get like and dislike count of a video
export const getLikeDislikeCount = async (req, res) => {
  try {
    // Get video ID from the URL parameter
    const { id } = req.params;

    // Find the video in MongoDB
    const video = await Video.findById(id);

    // Check whether the video exists
    if (!video) {
      return errorResponse(res, 404, "Video not found");
    }

    // Count how many users liked this video
    const likes = await Like.countDocuments({
      video: id,
      isLike: true,
    });

    // Count how many users disliked this video
    const dislikes = await Like.countDocuments({
      video: id,
      isLike: false,
    });

    // Send the like and dislike counts to the client
    return successResponse(
      res,
      200,
      "Like/dislike count fetched successfully",
      {
        likes,
        dislikes,
      },
    );
  } catch (error) {
    // Print the error in the server console for debugging
    console.error("Get like/dislike count error:", error);

    // Send error response to the client
    return errorResponse(
      res,
      500,
      "Failed to get like/dislike count",
    );
  }
};