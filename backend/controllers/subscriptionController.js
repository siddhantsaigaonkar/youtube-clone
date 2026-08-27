
import Channel from "../models/channelModel.js";
import Subscription from "../models/subscriptionModel.js";
import { successResponse, errorResponse } from "../utils/response.js";

// ===============================
// SUBSCRIBE TO CHANNEL
// ===============================

export const subscribe = async (req, res) => {
  try {
    const { channelId } = req.params;

    const userId = req.user._id;

    // Check channel exists
    const channel = await Channel.findById(channelId);

    if (!channel) {
      return errorResponse(res, 404, "Channel not found");
    }

    // User cannot subscribe to own channel
    if (channel.owner.toString() === userId.toString()) {
      return errorResponse(
        res,
        400,
        "You cannot subscribe to your own channel",
      );
    }

    // Check if already subscribed
    const existingSubscription = await Subscription.findOne({
      subscriber: userId,
      channel: channelId,
    });

    if (existingSubscription) {
      return errorResponse(
        res,
        400,
        "You are already subscribed to this channel",
      );
    }

    // Create subscription
    const subscription = await Subscription.create({
      subscriber: userId,
      channel: channelId,
    });

    // Increase subscriber count
    await Channel.findByIdAndUpdate(channelId, {
      $inc: { subscribers: 1 },
    });

    return successResponse(res, 201, "Subscribed successfully", subscription);
  } catch (error) {
    console.error("Subscribe error:", error);

    return errorResponse(res, 500, "Failed to subscribe to channel");
  }
};

// ===============================
// UNSUBSCRIBE FROM CHANNEL
// ===============================

export const unsubscribe = async (req, res) => {
  try {
    const { channelId } = req.params;

    const userId = req.user._id;

    // Find subscription
    const subscription = await Subscription.findOne({
      subscriber: userId,
      channel: channelId,
    });

    if (!subscription) {
      return errorResponse(res, 404, "You are not subscribed to this channel");
    }

    // Delete subscription
    await Subscription.deleteOne({
      _id: subscription._id,
    });

    // Decrease subscriber count
    await Channel.findByIdAndUpdate(channelId, {
      $inc: { subscribers: -1 },
    });

    return successResponse(res, 200, "Unsubscribed successfully");
  } catch (error) {
    console.error("Unsubscribe error:", error);

    return errorResponse(res, 500, "Failed to unsubscribe from channel");
  }
};

// ===============================
// GET MY SUBSCRIPTIONS
// ===============================

export const getMySubscriptions = async (req, res) => {
  try {
    const userId = req.user._id;

    const subscriptions = await Subscription.find({
      subscriber: userId,
    })
      .populate("channel")
      .sort({ createdAt: -1 });

    return successResponse(
      res,
      200,
      "Subscriptions fetched successfully",
      subscriptions,
    );
  } catch (error) {
    console.error("Get subscriptions error:", error);

    return errorResponse(res, 500, "Failed to fetch subscriptions");
  }
};

// ===============================
// CHECK SUBSCRIPTION
// ===============================

export const checkSubscription = async (req, res) => {
  try {
    const { channelId } = req.params;

    const userId = req.user._id;

    const subscription = await Subscription.findOne({
      subscriber: userId,
      channel: channelId,
    });

    return successResponse(
      res,
      200,
      "Subscription status fetched successfully",
      {
        subscribed: !!subscription,
      },
    );
  } catch (error) {
    console.error("Check subscription error:", error);

    return errorResponse(res, 500, "Failed to check subscription");
  }
};
