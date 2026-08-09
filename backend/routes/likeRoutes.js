import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import { likeVideo } from "../controllers/likeController.js";


const router = express.Router();

// Like or dislike a video
router.post("/:id", authMiddleware, likeVideo);

export default router;
