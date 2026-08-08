
import cloudinary from "../config/cloudinary.js";
import Video from "../models/videoModel.js";
import { successResponse, errorResponse } from "../utils/response.js";

export const uploadVideo = async (req, res) => {
  try {
    // Get video information from the request body
    const { title, description, category } = req.body;

    // Check whether both video and thumbnail files were uploaded
    if (!req.files?.video || !req.files?.thumbnail) {
      return errorResponse(res, 400, "Video and thumbnail are required");
    }

    // Get the uploaded files from Multer
    const videoFile = req.files.video[0];
    const thumbnailFile = req.files.thumbnail[0];

    // Convert video buffer to Base64 format for Cloudinary
    const videoData = `data:${videoFile.mimetype};base64,${videoFile.buffer.toString(
      "base64",
    )}`;

    // Upload video to Cloudinary
    const videoResult = await cloudinary.uploader.upload(videoData, {
      resource_type: "video",
      folder: "youtube-clone/videos",
    });

    // Convert thumbnail buffer to Base64 format
    const thumbnailData = `data:${thumbnailFile.mimetype};base64,${thumbnailFile.buffer.toString(
      "base64",
    )}`;

    // Upload thumbnail to Cloudinary
    const thumbnailResult = await cloudinary.uploader.upload(thumbnailData, {
      resource_type: "image",
      folder: "youtube-clone/thumbnails",
    });

    // Create video document in MongoDB
    const video = await Video.create({
      title,
      description,
      category,
      videoUrl: videoResult.secure_url,
      thumbnailUrl: thumbnailResult.secure_url,

      // User is provided by authMiddleware after JWT verification
      owner: req.user._id,
    });

    // Send successful response
    return successResponse(res, 201, "Video uploaded successfully", video);
  } catch (error) {
    console.error("Upload video error:", error);

    // Send error response if upload or database operation fails
    return errorResponse(res, 500, "Failed to upload video");
  }
};



// Get all videos
export const getAllVideos = async (req, res) => {
  try {
    // Fetch all videos from MongoDB
    const videos = await Video.find()
      .populate("owner", "name profilePic")
      .sort({ createdAt: -1 });

    // Send successful response
    return successResponse(
      res,
      200,
      "Videos fetched successfully",
      videos
    );
  } catch (error) {
    console.error("Get all videos error:", error);

    // Send error response
    return errorResponse(
      res,
      500,
      "Failed to fetch videos"
    );
  }
};


// Get a single video by its ID
export const getVideoById = async (req, res) => {
  try {
    // Get the video ID from the URL parameter
    const { id } = req.params;

    // Find the video in MongoDB and include basic owner information
    const video = await Video.findById(id)
      .populate("owner", "name profilePic");

    // Check if the video exists
    if (!video) {
      return errorResponse(
        res,
        404,
        "Video not found"
      );
    }

    // Return the requested video
    return successResponse(
      res,
      200,
      "Video fetched successfully",
      video
    );
  } catch (error) {
    console.error("Get video by ID error:", error);

    return errorResponse(
      res,
      500,
      "Failed to fetch video"
    );
  }
};


// Delete a video
export const deleteVideo = async (req, res) => {
  try {
    // Get the video ID from the URL parameter
    const { id } = req.params;

    // Find the video by ID
    const video = await Video.findById(id);

    // Check whether the video exists
    if (!video) {
      return errorResponse(res, 404, "Video not found");
    }

    // Check whether the logged-in user owns this video
    if (video.owner.toString() !== req.user._id.toString()) {
      return errorResponse(
        res,
        403,
        "You are not authorized to delete this video"
      );
    }

    // Delete the video from MongoDB
    await Video.findByIdAndDelete(id);

    // Send successful response
    return successResponse(
      res,
      200,
      "Video deleted successfully"
    );
  } catch (error) {
    console.error("Delete video error:", error);

    return errorResponse(
      res,
      500,
      "Failed to delete video"
    );
  }
};