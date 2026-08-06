// Import mongoose
import mongoose from "mongoose";

// Create User Schema
const userSchema = new mongoose.Schema(
  {
    // User's full name
    name: {
      type: String,
      required: true,
      trim: true,
    },

    // User's email address
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    // User's encrypted password
    password: {
      type: String,
      required: true,
    },

    // User profile picture
    profilePic: {
      type: String,
      default: "",
    },
  },
  {
    // Automatically adds createdAt and updatedAt
    timestamps: true,
  },
);

// Create User Model
const User = mongoose.model("User", userSchema);

// Export User Model
export default User;
