// Import mongoose
import mongoose from "mongoose";

// Create Comment schema
const commentSchema = new mongoose.Schema(
  {
    // The text/content written by the user
    text: {
      type: String,
      required: true,
      trim: true,
      maxlength: 1000, // Maximum comment length
    },

    // The user who wrote the comment
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // The video on which the comment was posted
    video: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Video",
      required: true,
    },
  },
  {
    // Automatically create createdAt and updatedAt
    timestamps: true,
  },
);

// Create Comment model
const Comment = mongoose.model("Comment", commentSchema);

// Export Comment model
export default Comment;
