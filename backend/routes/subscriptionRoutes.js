import express from "express";

import {
  subscribe,
  unsubscribe,
  getMySubscriptions,
  checkSubscription,
} from "../controllers/subscriptionController.js";

import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// Subscribe
router.post("/:channelId", authMiddleware, subscribe);

// Unsubscribe
router.delete("/:channelId", authMiddleware, unsubscribe);

// Get logged-in user's subscriptions
router.get("/my", authMiddleware, getMySubscriptions);

// Check whether logged-in user subscribed
router.get("/check/:channelId", authMiddleware, checkSubscription);

export default router;
