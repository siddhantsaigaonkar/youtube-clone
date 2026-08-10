// Import Express
import express from "express";
// Import authentication middleware
import authMiddleware from "../middleware/authMiddleware.js";
// Import comment controller
import { createComment,getComments } from "../controllers/commentController.js";




// Create Express router
const router = express.Router();

// Create a comment on a video
// User must be logged in to comment
router.post("/:videoId", authMiddleware, createComment);


// Get all comments for a video
router.get("/:videoId", getComments);




// Export router
export default router;
