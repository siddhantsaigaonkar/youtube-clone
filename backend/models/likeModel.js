import mongoose from "mongoose";

const likeSchema = new mongoose.Schema(
  {
    // User who liked/disliked the video
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // Video that was liked/disliked
    video: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Video",
      required: true,
    },

    // true = like, false = dislike
    isLike: {
      type: Boolean,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

const Like = mongoose.model("Like", likeSchema);

export default Like;
