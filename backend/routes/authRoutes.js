import express from "express";
import { signup,signin,getCurrentUser } from "../controllers/authController.js";
import { validateSignup, validateLogin } from "../middleware/authValidation.js";
import authMiddleware from "../middleware/authMiddleware.js";


const router = express.Router();

// Register a new user
router.post("/signup", validateSignup, signup);

// Login existing user
router.post("/signin", validateLogin, signin);

// Get logged-in user's profile
router.get("/me", authMiddleware, getCurrentUser);

export default router; 