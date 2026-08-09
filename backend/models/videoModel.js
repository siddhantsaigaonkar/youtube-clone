// Import mongoose
import mongoose from "mongoose";

// Create Video Schema
const videoSchema = new mongoose.Schema(
  {
    // Title of the video
    title: {
      type: String,
      required: true,
      trim: true,
    },

    // Short description about the video
    description: {
      type: String,
      required: true,
      trim: true,
    },

    // Cloudinary URL of the uploaded video
    videoUrl: {
      type: String,
      required: true,
    },

    // Cloudinary URL of the video thumbnail
    thumbnailUrl: {
      type: String,
      required: true,
    },

    // Category of the video
    category: {
      type: String,
      default: "General",
      trim: true,
    },

    // Total number of views
    views: {
      type: Number,
      default: 0,
    },

    // Reference to the user who uploaded the video
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // Controls whether the video is public or private
    isPublished: {
      type: Boolean,
      default: true,
    },

    videoPublicId: {
      type: String,
      required: true,
    },

    thumbnailPublicId: {
      type: String,
      required: true,
    },
  },
  {
    // Automatically create createdAt and updatedAt fields
    timestamps: true,
  },
);

// Create Video model
const Video = mongoose.model("Video", videoSchema);

// Export Video model
export default Video;
