// Import Channel model
import cloudinary from "../config/cloudinary.js";
import Channel from "../models/channelModel.js";

// Import Video model
import Video from "../models/videoModel.js";

// Import response helper functions
import { successResponse, errorResponse } from "../utils/response.js";


export const createChannel = async (req, res) => {
  try {
    // Get channel information from request body
    const { name, description } = req.body;

    // Check whether channel name is provided
    if (!name) {
      return errorResponse(res, 400, "Channel name is required");
    }

    // Check whether logged-in user already has a channel
    const existingChannel = await Channel.findOne({
      owner: req.user._id,
    });

    // A user can have only one channel
    if (existingChannel) {
      return errorResponse(res, 400, "You already have a channel");
    }

    // Check whether profile picture and banner were uploaded
    if (!req.files?.profilePic || !req.files?.banner) {
      return errorResponse(res, 400, "Profile picture and banner are required");
    }

    // Get uploaded files from Multer
    const profilePicFile = req.files.profilePic[0];
    const bannerFile = req.files.banner[0];

    // Convert profile picture to Base64
    const profilePicData = `data:${profilePicFile.mimetype};base64,${profilePicFile.buffer.toString(
      "base64",
    )}`;

    // Upload profile picture to Cloudinary
    const profilePicResult = await cloudinary.uploader.upload(profilePicData, {
      resource_type: "image",
      folder: "youtube-clone/channels/profile-pics",
    });

    // Convert banner to Base64
    const bannerData = `data:${bannerFile.mimetype};base64,${bannerFile.buffer.toString(
      "base64",
    )}`;

    // Upload banner to Cloudinary
    const bannerResult = await cloudinary.uploader.upload(bannerData, {
      resource_type: "image",
      folder: "youtube-clone/channels/banners",
    });

    // Create channel
    const channel = await Channel.create({
      name,
      description,

      // Save Cloudinary URLs
      profilePic: profilePicResult.secure_url,
      profilePicPublicId: profilePicResult.public_id,

      banner: bannerResult.secure_url,
      bannerPublicId: bannerResult.public_id,

      // Store logged-in user as owner
      owner: req.user._id,
    });

    // Send successful response
    return successResponse(res, 201, "Channel created successfully", channel);
  } catch (error) {
    console.error("Create channel error:", error);

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

    // Check whether the channel exists
    if (!channelData) {
      return errorResponse(res, 404, "Channel not found");
    }

    let channel = channelData.toObject();
    // Check whether the channel exists
    if (!channel) {
      return errorResponse(res, 404, "Channel not found");
    }

    // Send channel information
    return successResponse(res, 200, "Channel fetched successfully", channel);
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



// Get the channel of the logged-in user
export const getMyChannel = async (req, res) => {
  try {
    // Find channel owned by the logged-in user
    const channel = await Channel.findOne({
      owner: req.user._id,
    }).populate(
      "owner",
      "name email profilePic",
    );

    // Check whether the user has created a channel
    if (!channel) {
      return errorResponse(
        res,
        404,
        "Channel not found",
      );
    }

    // Send channel information
    return successResponse(
      res,
      200,
      "My channel fetched successfully",
      channel,
    );
  } catch (error) {
    console.error("Get my channel error:", error);

    return errorResponse(
      res,
      500,
      "Failed to fetch my channel",
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




// Get all channels
export const getAllChannels = async (req, res) => {
  try {
    // Find all channels
    const channels = await Channel.find()
      .populate("owner", "name email profilePic")
      .sort({ createdAt: -1 });

    // Send all channels
    return successResponse(
      res,
      200,
      "Channels fetched successfully",
      channels,
    );
  } catch (error) {
    console.error("Get all channels error:", error);

    return errorResponse(
      res,
      500,
      "Failed to fetch channels",
    );
  }
};




// Delete channel
export const deleteChannel = async (req, res) => {
  try {
    // Get channel ID from URL
    const { id } = req.params;

    // Find channel
    const channel = await Channel.findById(id);

    // Check whether channel exists
    if (!channel) {
      return errorResponse(res, 404, "Channel not found");
    }

    // Check whether logged-in user owns this channel
    if (channel.owner.toString() !== req.user._id.toString()) {
      return errorResponse(
        res,
        403,
        "You are not authorized to delete this channel",
      );
    }

    // Delete profile picture from Cloudinary
    if (channel.profilePicPublicId) {
      await cloudinary.uploader.destroy(
        channel.profilePicPublicId,
        {
          resource_type: "image",
        },
      );
    }

    // Delete banner from Cloudinary
    if (channel.bannerPublicId) {
      await cloudinary.uploader.destroy(
        channel.bannerPublicId,
        {
          resource_type: "image",
        },
      );
    }

    // Delete channel from MongoDB
    await Channel.findByIdAndDelete(id);

    // Send successful response
    return successResponse(
      res,
      200,
      "Channel deleted successfully",
    );
  } catch (error) {
    console.error("Delete channel error:", error);

    return errorResponse(
      res,
      500,
      "Failed to delete channel",
    );
  }
};



// Update channel
export const updateChannel = async (req, res) => {
  try {
    // Get channel ID from URL
    const { id } = req.params;

    // Find channel
    const channel = await Channel.findById(id);

    // Check whether channel exists
    if (!channel) {
      return errorResponse(res, 404, "Channel not found");
    }

    // Check whether logged-in user owns this channel
    if (channel.owner.toString() !== req.user._id.toString()) {
      return errorResponse(
        res,
        403,
        "You are not authorized to update this channel",
      );
    }

    // Get text fields from request
    const { name, description } = req.body;

    // Update name if provided
    if (name) {
      channel.name = name;
    }

    // Update description if provided
    if (description) {
      channel.description = description;
    }

    // Check whether new profile picture was uploaded
    if (req.files?.profilePic) {
      const profilePicFile = req.files.profilePic[0];

      // Delete old profile picture from Cloudinary
      if (channel.profilePicPublicId) {
        await cloudinary.uploader.destroy(
          channel.profilePicPublicId,
          {
            resource_type: "image",
          },
        );
      }

      // Convert image buffer to Base64
      const profilePicData = `data:${profilePicFile.mimetype};base64,${profilePicFile.buffer.toString(
        "base64",
      )}`;

      // Upload new profile picture
      const profilePicResult =
        await cloudinary.uploader.upload(profilePicData, {
          resource_type: "image",
          folder: "youtube-clone/channels/profile-pics",
        });

      // Save new image URL and public ID
      channel.profilePic = profilePicResult.secure_url;
      channel.profilePicPublicId = profilePicResult.public_id;
    }

    // Check whether new banner was uploaded
    if (req.files?.banner) {
      const bannerFile = req.files.banner[0];

      // Delete old banner from Cloudinary
      if (channel.bannerPublicId) {
        await cloudinary.uploader.destroy(
          channel.bannerPublicId,
          {
            resource_type: "image",
          },
        );
      }

      // Convert banner to Base64
      const bannerData = `data:${bannerFile.mimetype};base64,${bannerFile.buffer.toString(
        "base64",
      )}`;

      // Upload new banner
      const bannerResult =
        await cloudinary.uploader.upload(bannerData, {
          resource_type: "image",
          folder: "youtube-clone/channels/banners",
        });

      // Save new banner URL and public ID
      channel.banner = bannerResult.secure_url;
      channel.bannerPublicId = bannerResult.public_id;
    }

    // Save updated channel
    await channel.save();

    // Send successful response
    return successResponse(
      res,
      200,
      "Channel updated successfully",
      channel,
    );
  } catch (error) {
    console.error("Update channel error:", error);

    return errorResponse(
      res,
      500,
      "Failed to update channel",
    );
  }
};