import mongoose from "mongoose";

const channelSchema = new mongoose.Schema(
  {
    // Name of the channel
    name: {
      type: String,
      required: true,
      trim: true,
    },

    // Description of the channel
    description: {
      type: String,
      trim: true,
      default: "",
    },

    // Channel profile picture
    profilePic: {
      type: String,
      default: "",
    },

    profilePicPublicId: {
      type: String,
      default: "",
    },

    // Channel banner image
    banner: {
      type: String,
      default: "",
    },

    bannerPublicId: {
      type: String,
      default: "",
    },

    // User who owns this channel
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },

    // Number of subscribers
    subscribers: {
      type: Number,
      default: 0,
    },
  },
  {
    // Automatically create createdAt and updatedAt
    timestamps: true,
  },
);

// Create Channel model
const Channel = mongoose.model("Channel", channelSchema);

// Export Channel model
export default Channel;