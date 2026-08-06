// Import Express framework
import express from "express";


import connectDB from "./config/db.js";

// Import dotenv to load environment variables
import dotenv from "dotenv";


// Load variables from .env file
dotenv.config();

// Create Express application
const app = express();

// Read PORT from .env, or use 5000 if not defined
const PORT = process.env.PORT || 5000;

connectDB()
// Test route to verify the server is running
app.get("/", (req, res) => {
  res.send("YouTube Clone Backend Running ");
});

// Start the Express server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
