

import express from "express";
import { signup,signin } from "../controllers/authController.js";
import { validateSignup,validateLogin } from "../middleware/authValidation.js";

const router = express.Router();

// Register a new user
router.post("/signup", validateSignup, signup);

// Login existing user
router.post("/signin", validateLogin, signin);

export default router; 