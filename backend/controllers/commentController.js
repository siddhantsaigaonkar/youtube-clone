// Import Comment model
import Comment from "../models/commentModel.js";
// Import Video model
import Video from "../models/videoModel.js";
// Import response helper functions
import { successResponse,errorResponse } from "../utils/response.js";



// Create a comment on a video
export const createComment = async (req, res) => {
  try {
    // Get video ID from the URL parameter
    const { videoId } = req.params;

    // Get comment text from request body
    const { text } = req.body;

    // Check whether comment text was provided
    if (!text || !text.trim()) {
      return errorResponse(res, 400, "Comment text is required");
    }

    // Check whether the video exists
    const video = await Video.findById(videoId);

    if (!video) {
      return errorResponse(res, 404, "Video not found");
    }

    // Create the comment
    const comment = await Comment.create({
      text: text.trim(),

      // Store the logged-in user's ID
      user: req.user._id,

      // Store the video ID
      video: videoId,
    });

    // Get user information along with the comment
    const populatedComment = await Comment.findById(comment._id).populate(
      "user",
      "name profilePic",
    );

    // Convert Mongoose document into a normal JavaScript object
    const commentData = populatedComment.toObject();
    // Send successful response
    return successResponse(
      res,
      201,
      "Comment added successfully",
      commentData,
    );
  } catch (error) {
    // Print error in server console for debugging
    console.error("Create comment error:", error);

    // Send error response
    return errorResponse(res, 500, "Failed to add comment");
  }
};



// Get all comments for a video
export const getComments = async (req, res) => {
  try {
    // Get video ID from the URL parameter
    const { videoId } = req.params;

    // Check whether the video exists
    const video = await Video.findById(videoId);

    // Return error if video does not exist
    if (!video) {
      return errorResponse(res, 404, "Video not found");
    }

    // Find all comments belonging to this video
    const comments = await Comment.find({
      video: videoId,
    })
      // Get user information instead of only storing user ID
      .populate("user", "name profilePic")

      // Show newest comments first
      .sort({ createdAt: -1 });

    // Send comments to the client
    return successResponse(
      res,
      200,
      "Comments fetched successfully",
      comments,
    );
  } catch (error) {
    // Print error in server console for debugging
    console.error("Get comments error:", error);

    // Send error response
    return errorResponse(
      res,
      500,
      "Failed to fetch comments",
    );
  }
};



// Delete a comment
export const deleteComment = async (req, res) => {
  try {
    // Get comment ID from the URL parameter
    const { commentId } = req.params;

    // Find the comment
    const comment = await Comment.findById(commentId);

    // Check whether the comment exists
    if (!comment) {
      return errorResponse(res, 404, "Comment not found");
    }

    // Check whether the logged-in user owns this comment
    if (comment.user.toString() !== req.user._id.toString()) {
      return errorResponse(
        res,
        403,
        "You are not authorized to delete this comment",
      );
    }

    // Delete the comment from MongoDB
    await Comment.findByIdAndDelete(commentId);

    // Send successful response
    return successResponse(
      res,
      200,
      "Comment deleted successfully",
    );
  } catch (error) {
    // Print error in server console for debugging
    console.error("Delete comment error:", error);

    // Send error response
    return errorResponse(
      res,
      500,
      "Failed to delete comment",
    );
  }
};



// Update a comment
export const updateComment = async (req, res) => {
  try {
    // Get comment ID from the URL parameter
    const { commentId } = req.params;

    // Get the new comment text from request body
    const { text } = req.body;

    // Check whether comment text was provided
    if (!text || !text.trim()) {
      return errorResponse(res, 400, "Comment text is required");
    }

    // Find the comment
    const comment = await Comment.findById(commentId);

    // Check whether the comment exists
    if (!comment) {
      return errorResponse(res, 404, "Comment not found");
    }

    // Check whether the logged-in user owns this comment
    if (comment.user.toString() !== req.user._id.toString()) {
      return errorResponse(
        res,
        403,
        "You are not authorized to edit this comment",
      );
    }

    // Update the comment text
    comment.text = text.trim();

    // Save the updated comment
    await comment.save();

    // Get user information along with the updated comment
    const updatedComment = await Comment.findById(comment._id).populate(
      "user",
      "name profilePic",
    );

    // Convert Mongoose document into a normal JavaScript object
    const commentData = updatedComment.toObject();
    // Send successful response
    return successResponse(
      res,
      200,
      "Comment updated successfully",
      commentData,
    );
  } catch (error) {
    // Print error in server console for debugging
    console.error("Update comment error:", error);

    // Send error response
    return errorResponse(
      res,
      500,
      "Failed to update comment",
    );
  }
};