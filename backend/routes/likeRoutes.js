import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import { likeVideo,getLikeDislikeCount } from "../controllers/likeController.js";


const router = express.Router();

// Like or dislike a video
router.post("/:id", authMiddleware, likeVideo);

router.get("/:id", getLikeDislikeCount);

export default router;
