// Import Channel model
import Channel from "../models/channelModel.js";
// Import response helper functions
import { successResponse,errorResponse } from "../utils/response.js";

// Create a new channel
export const createChannel = async (req, res) => {
  try {
    // Get channel information from the request body
    const { name, description, profilePic, banner } = req.body;

    // Check whether channel name is provided
    if (!name) {
      return errorResponse(res, 400, "Channel name is required");
    }

    // Check whether the logged-in user already has a channel
    const existingChannel = await Channel.findOne({
      owner: req.user._id,
    });

    // A user can have only one channel
    if (existingChannel) {
      return errorResponse(res, 400, "You already have a channel");
    }

    // Create the channel
    const channel = await Channel.create({
      name,
      description,
      profilePic,
      banner,

      // Store the logged-in user's ID as channel owner
      owner: req.user._id,
    });

    // Send successful response
    return successResponse(res, 201, "Channel created successfully", channel);
  } catch (error) {
    // Print error in server console for debugging
    console.error("Create channel error:", error);

    // Send error response
    return errorResponse(res, 500, "Failed to create channel");
  }
};
