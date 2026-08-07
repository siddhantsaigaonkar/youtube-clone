import express from "express";
import upload from "../middleware/uploadMiddleware.js";
import authMiddleware from "../middleware/authMiddleware.js";
import { uploadVideo } from "../controllers/videoController.js";


const router = express.Router();

// Upload a video with its thumbnail
router.post(
  "/upload",
  authMiddleware,
  upload.fields([
    { name: "video", maxCount: 1 },
    { name: "thumbnail", maxCount: 1 },
  ]),
  uploadVideo,
);

export default router;
