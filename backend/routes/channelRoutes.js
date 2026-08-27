// Import Express
import express from "express";

// Import authentication middleware
import authMiddleware from "../middleware/authMiddleware.js";

// Import channel controllers
import {
  createChannel,
  getChannel,
  getChannelVideos,
  getMyChannel,
  getAllChannels
} from "../controllers/channelController.js";

// Import upload middleware
import upload from "../middleware/uploadMiddleware.js";

// Create Express router
const router = express.Router();

// =====================================================
// CREATE CHANNEL
// =====================================================

// User must be logged in
router.post(
  "/",
  authMiddleware,
  upload.fields([
    { name: "profilePic", maxCount: 1 },
    { name: "banner", maxCount: 1 },
  ]),
  createChannel,
);



// =====================================================
// GET ALL channels
// =====================================================

router.get("/", getAllChannels);



// =====================================================
// GET MY CHANNEL
// =====================================================

// Get channel of the currently logged-in user
router.get("/my-channel", authMiddleware, getMyChannel);

// =====================================================
// GET CHANNEL INFORMATION
// =====================================================

// Login is not required
router.get("/:channelId", getChannel);

// =====================================================
// GET CHANNEL VIDEOS
// =====================================================

// Get all videos uploaded by this channel
router.get("/:channelId/videos", getChannelVideos);

// Export router
export default router;
