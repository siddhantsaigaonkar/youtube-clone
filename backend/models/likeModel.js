import mongoose from "mongoose";

// Create schema for storing likes and dislikes
const likeSchema = new mongoose.Schema(
  {
    // Store the ID of the user who liked or disliked the video
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // Store the ID of the video that was liked or disliked
    video: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Video",
      required: true,
    },

    // true  = Like
    // false = Dislike
    isLike: {
      type: Boolean,
      required: true,
    },
  },
  {
    // Automatically add createdAt and updatedAt fields
    timestamps: true,
  },
);

// Make sure one user can have only ONE
// like/dislike record for the same video
//
// Example:
// Sid + Video A → allowed
// Sid + Video A → not allowed again
//
// But:
// Sid + Video B → allowed
// Rahul + Video A → allowed
likeSchema.index(
  {
    user: 1,
    video: 1,
  },
  {
    unique: true,
  },
);

// Create Like model from the schema
const Like = mongoose.model("Like", likeSchema);

// Export Like model so controllers can use it
export default Like;
