// Import Express
import express from "express";

// Import authentication middleware
import authMiddleware from "../middleware/authMiddleware.js";

// Import channel controller
import { createChannel,getChannel } from "../controllers/channelController.js";



// Create Express router
const router = express.Router();

// Create a new channel
// User must be logged in to create a channel
router.post("/", authMiddleware, createChannel);


// Get channel information
// Login is not required to view a channel
router.get("/:channelId", getChannel);

// Export router
export default router;
