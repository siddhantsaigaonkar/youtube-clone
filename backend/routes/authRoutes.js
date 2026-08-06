

import express from "express";
import { signup } from "../controllers/authController.js";
import validateSignup from "../middleware/validateSignup.js";

const router = express.Router();

// Register a new user
router.post("/signup", validateSignup, signup);

export default router;