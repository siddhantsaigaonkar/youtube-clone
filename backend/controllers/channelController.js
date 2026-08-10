// Import Channel model
import Channel from "../models/channelModel.js";

// Import Video model
import Video from "../models/videoModel.js";

// Import response helper functions
import { successResponse, errorResponse } from "../utils/response.js";



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



// Get channel information
export const getChannel = async (req, res) => {
  try {
    // Get channel ID from the URL parameter
    const { channelId } = req.params;

    // Find the channel by its ID
    const channelData = await Channel.findById(channelId).populate(
      "owner",
      "name email profilePic",
    );

    let channel = channelData.toObject()
    // Check whether the channel exists
    if (!channel) {
      return errorResponse(res, 404, "Channel not found");
    }

    // Send channel information
    return successResponse(
      res,
      200,
      "Channel fetched successfully",
      channel,
    );
  } catch (error) {
    // Print error in server console for debugging
    console.error("Get channel error:", error);

    // Send error response
    return errorResponse(
      res,
      500,
      "Failed to fetch channel",
    );
  }
};



// Get all videos uploaded by a channel owner
export const getChannelVideos = async (req, res) => {
  try {
    // Get channel ID from the URL parameter
    const { channelId } = req.params;

    // Find the channel
    const channel = await Channel.findById(channelId);

    // Check whether the channel exists
    if (!channel) {
      return errorResponse(res, 404, "Channel not found");
    }

    // Find all videos uploaded by the channel owner
    const videos = await Video.find({
      owner: channel.owner,
    }).sort({ createdAt: -1 });

    // Send the channel videos
    return successResponse(
      res,
      200,
      "Channel videos fetched successfully",
      videos,
    );
  } catch (error) {
    // Print error in server console for debugging
    console.error("Get channel videos error:", error);

    // Send error response
    return errorResponse(
      res,
      500,
      "Failed to fetch channel videos",
    );
  }
};