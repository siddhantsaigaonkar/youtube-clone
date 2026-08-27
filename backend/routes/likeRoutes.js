import express from "express";

import {
  likeVideo,
  getLikeDislikeCount,
} from "../controllers/likeController.js";
import authMiddleware from "../middleware/authMiddleware.js";
import optionalAuthMiddleware from "../middleware/optionalAuthMiddleware.js";

const router = express.Router();

// Like or dislike a video
// Login is required
router.post("/:id", authMiddleware, likeVideo);

// Get like/dislike count
// Login is optional
router.get("/:id", optionalAuthMiddleware, getLikeDislikeCount);

export default router;
