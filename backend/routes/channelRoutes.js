// Import Express
import express from "express";

// Import authentication middleware
import authMiddleware from "../middleware/authMiddleware.js";

// Import channel controller
import { createChannel } from "../controllers/channelController.js";



// Create Express router
const router = express.Router();

// Create a new channel
// User must be logged in to create a channel
router.post("/", authMiddleware, createChannel);

// Export router
export default router;
