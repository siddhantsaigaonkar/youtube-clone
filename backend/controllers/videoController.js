
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