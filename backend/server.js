// Import dotenv to load environment variables
import "dotenv/config";

// Import Express framework
import express from "express";
import videoRoutes from "./routes/videoRoutes.js";

// Import database connection
import connectDB from "./config/db.js";

// Import authRoute 
import authRoutes from "./routes/authRoutes.js";


// import likeRoute
import likeRoutes from "./routes/likeRoutes.js";

// Import channel routes
import channelRoutes from "./routes/channelRoutes.js"


// Create Express application
const app = express();

// Read PORT from .env, or use 5000 if not defined
const PORT = process.env.PORT || 5000;

connectDB()

// Parse incoming JSON data
app.use(express.json());

// Authentication routes
app.use("/api/auth", authRoutes);

//  Video routes
app.use("/api/videos", videoRoutes);

//  Like routes
app.use("/api/likes", likeRoutes);
// Test route to verify the server is running


// Use channel routes
app.use("/api/channels", channelRoutes);

app.get("/", (req, res) => {
  res.send("YouTube Clone Backend Running ");
});

// Start the Express server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
