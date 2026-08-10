import cloudinary from "../config/cloudinary.js";
import Video from "../models/videoModel.js";
import { successResponse, errorResponse } from "../utils/response.js";

export const uploadVideo = async (req, res) => {
  try {
    // Get video information from the request body
    const { title, description, category } = req.body;

    console.log(req);

    // Check whether both video and thumbnail files were uploaded
    if (!req.files?.video || !req.files?.thumbnail) {
      return errorResponse(res, 400, "Video and thumbnail are required");
    }

    // Get the uploaded files from Multer
    const videoFile = req.files.video[0];
    const thumbnailFile = req.files.thumbnail[0];

    // Convert video buffer to Base64 format for Cloudinary
    const videoData = `data:${videoFile.mimetype};base64,${videoFile.buffer.toString("base64")}`;

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

      // Video Cloudinary details
      videoUrl: videoResult.secure_url,
      videoPublicId: videoResult.public_id,

      // Thumbnail Cloudinary details
      thumbnailUrl: thumbnailResult.secure_url,
      thumbnailPublicId: thumbnailResult.public_id,

      // User is provided by authMiddleware after JWT verification
      owner: req.user._id,
    });

    // Convert Mongoose document into a normal JavaScript object
    const Data = video.toObject();

    // Send only the actual video data
    return successResponse(res, 201, "Video uploaded successfully", Data);

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

    if (videos.length === 0) {
       return successResponse(res, 200, "no video added ");
    }
    // Send successful response
    return successResponse(res, 200, "Videos fetched successfully", videos);
  } catch (error) {
    console.error("Get all videos error:", error);

    // Send error response
    return errorResponse(res, 500, "Failed to fetch videos");
  }
};

// Get a single video by its ID
export const getVideoById = async (req, res) => {
  try {
    // Get the video ID from the URL parameter
    const { id } = req.params;

    // Find the video in MongoDB and include basic owner information
    const video = await Video.findById(id).populate("owner", "name profilePic");

    // Check if the video exists
    if (!video) {
      return errorResponse(res, 404, "Video not found");
    }

    // Return the requested video
    return successResponse(res, 200, "Video fetched successfully", video);
  } catch (error) {
    console.error("Get video by ID error:", error);

    return errorResponse(res, 500, "Failed to fetch video");
  }
};

// Delete a video
export const deleteVideo = async (req, res) => {
  try {
    // Get the video ID from the URL parameter
    const { id } = req.params;

    // Find the video by ID
    const video = await Video.findById(id);

    console.log(video);
    

    // Check whether the video exists
    if (!video) {
      return errorResponse(res, 404, "Video not found");
    }

    // Check whether the logged-in user owns this video
    if (video.owner.toString() !== req.user._id.toString()) {
      return errorResponse(
        res,
        403,
        "You are not authorized to delete this video",
      );
    }

    // Delete video from Cloudinary
    if (video.videoPublicId) {
      await cloudinary.uploader.destroy(video.videoPublicId, {
        resource_type: "video",
      });
    }

    // Delete thumbnail from Cloudinary
    if (video.thumbnailPublicId) {
      await cloudinary.uploader.destroy(video.thumbnailPublicId, {
        resource_type: "image",
      });
    }

    // Delete the video from MongoDB
    await Video.findByIdAndDelete(id);

    // Send successful response
    return successResponse(res, 200, "Video deleted successfully");
  } catch (error) {
    console.error("Delete video error:", error);

    return errorResponse(res, 500, "Failed to delete video");
  }
};


// Update video
export const updateVideo = async (req, res) => {
  try {
    // Get video ID from URL
    const { id } = req.params;

    // Get text fields from form-data
    const { title, description, category } = req.body;

    // Find video
    const video = await Video.findById(id);

    // Check if video exists
    if (!video) {
      return errorResponse(res, 404, "Video not found");
    }

    // Check ownership
    if (video.owner.toString() !== req.user._id.toString()) {
      return errorResponse(
        res,
        403,
        "You are not authorized to update this video",
      );
    }

    // Update text fields if provided
    if (title !== undefined) {
      video.title = title;
    }

    if (description !== undefined) {
      video.description = description;
    }

    if (category !== undefined) {
      video.category = category;
    }

    // ------------------------------------
    // Update video file
    // ------------------------------------
    if (req.files?.video?.[0]) {
      const videoFile = req.files.video[0];

      // Delete old video from Cloudinary
      if (video.videoPublicId) {
        await cloudinary.uploader.destroy(video.videoPublicId, {
          resource_type: "video",
        });
      }

      // Upload new video
      const videoUpload = await cloudinary.uploader.upload(
        `data:${videoFile.mimetype};base64,${videoFile.buffer.toString(
          "base64",
        )}`,
        {
          resource_type: "video",
          folder: "youtube-clone/videos",
        },
      );

      // Save new video URL and public ID
      video.videoUrl = videoUpload.secure_url;
      video.videoPublicId = videoUpload.public_id;
    }

    // ------------------------------------
    // Update thumbnail
    // ------------------------------------
    if (req.files?.thumbnail?.[0]) {
      const thumbnailFile = req.files.thumbnail[0];

      // Delete old thumbnail from Cloudinary
      if (video.thumbnailPublicId) {
        await cloudinary.uploader.destroy(video.thumbnailPublicId);
      }

      // Upload new thumbnail
      const thumbnailUpload = await cloudinary.uploader.upload(
        `data:${thumbnailFile.mimetype};base64,${thumbnailFile.buffer.toString(
          "base64",
        )}`,
        {
          folder: "youtube-clone/thumbnails",
        },
      );

      // Save new thumbnail URL and public ID
      video.thumbnailUrl = thumbnailUpload.secure_url;
      video.thumbnailPublicId = thumbnailUpload.public_id;
    }

    // Save updated video
    await video.save();

    // Send successful response
    return successResponse(
      res,
      200,
      "Video updated successfully",
      video,
    );
  } catch (error) {
    console.error("Update video error:", error);

    return errorResponse(
      res,
      500,
      "Failed to update video",
    );
  }
};


// Increase video view count
export const viewVideo = async (req, res) => {
  try {
    // Get video ID from the URL parameter
    const { id } = req.params;

    // Find the video by ID and increase views by 1
    const video = await Video.findByIdAndUpdate(
      id,
      {
        $inc: { views: 1 },
      },
      {
        new: true,
      },
    );

    // Check whether the video exists
    if (!video) {
      return errorResponse(res, 404, "Video not found");
    }

    // Send the updated view count to the client
    return successResponse(
      res,
      200,
      "Video view count updated successfully",
      {
        views: video.views,
      },
    );
  } catch (error) {
    // Print error in the server console for debugging
    console.error("View video error:", error);

    // Send error response to the client
    return errorResponse(res, 500, "Failed to update video views");
  }
};


// Search videos by title
export const searchVideos = async (req, res) => {
  try {
    // Get search text from the URL query
    const { search } = req.query;

    // Check whether search text is provided
    if (!search || !search.trim()) {
      return errorResponse(res, 400, "Search text is required");
    }

    // Find videos whose title contains the search text
    // $regex makes the search partial
    // $options: "i" makes the search case-insensitive
    const videos = await Video.find({
      title: {
        $regex: search.trim(),
        $options: "i",
      },
    }).sort({ createdAt: -1 });

    // Convert Mongoose documents into normal JavaScript objects
    const videoData = videos.map((video) => video.toObject());

    // Send search results
    return successResponse(
      res,
      200,
      "Videos searched successfully",
      videoData,
    );
  } catch (error) {
    // Print error in server console
    console.error("Search videos error:", error);

    // Send error response
    return errorResponse(
      res,
      500,
      "Failed to search videos",
    );
  }
};


// Filter videos by category
export const getVideosByCategory = async (req, res) => {
  try {
    // Get category from the URL parameter
    const { category } = req.params;

    // Check whether category is provided
    if (!category || !category.trim()) {
      return errorResponse(res, 400, "Category is required");
    }

    // Find videos that belong to the requested category
    const videos = await Video.find({
      category: category.trim(),
    }).sort({ createdAt: -1 });

    // Convert Mongoose documents into normal JavaScript objects
    const videoData = videos.map((video) => video.toObject());

    // Send filtered videos
    return successResponse(
      res,
      200,
      "Videos filtered by category successfully",
      videoData,
    );
  } catch (error) {
    // Print error in server console for debugging
    console.error("Filter videos by category error:", error);

    // Send error response
    return errorResponse(
      res,
      500,
      "Failed to filter videos by category",
    );
  }
};