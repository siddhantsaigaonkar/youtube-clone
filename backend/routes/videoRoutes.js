import express from "express";
import upload from "../middleware/uploadMiddleware.js";
import authMiddleware from "../middleware/authMiddleware.js";
import { uploadVideo,getAllVideos,getVideoById,deleteVideo,updateVideo,viewVideo } from "../controllers/videoController.js";


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

// Get all videos
router.get("/", getAllVideos);

// Get a single video by ID
router.get("/:id", getVideoById);

// Delete a video
router.delete(
  "/:id",
  authMiddleware,
  deleteVideo
);


// Update video
router.put(
  "/:id",
  authMiddleware,
  upload.fields([
    { name: "video", maxCount: 1 },
    { name: "thumbnail", maxCount: 1 },
  ]),
  updateVideo,
);


// Increase the view count of a video
router.post("/:id/view", viewVideo);

export default router;
