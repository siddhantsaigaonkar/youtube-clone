// Import dotenv to load environment variables
import "dotenv/config";

// Import CORS

import cors from "cors";

// Import Express framework
import express from "express";  

// Import database connection
import connectDB from "./config/db.js";

// Import videoRoute
import videoRoutes from "./routes/videoRoutes.js";

// Import authRoute 
import authRoutes from "./routes/authRoutes.js";

// import likeRoute
import likeRoutes from "./routes/likeRoutes.js";

// Import channel routes
import channelRoutes from "./routes/channelRoutes.js"

// Import comment routes
import commentRoutes from "./routes/commentRoutes.js";

// Import subscription routes
import subscriptionRoutes from "./routes/subscriptionRoutes.js";

// Create Express application
const app = express();

// Read PORT from .env, or use 5000 if not defined
const PORT = process.env.PORT || 5000;

connectDB()

// Parse incoming JSON data
app.use(express.json());

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
);

// Parse URL-encoded data
app.use(express.urlencoded({ extended: true }));

// Authentication routes
app.use("/api/auth", authRoutes);

//  Video routes
app.use("/api/videos", videoRoutes);

//  Like routes
app.use("/api/likes", likeRoutes);

// Use channel routes
app.use("/api/channels", channelRoutes);

// Use comment routes
app.use("/api/comments", commentRoutes);


// Use subscription routes
app.use("/api/subscriptions", subscriptionRoutes);


app.get("/", (req, res) => {
  res.send("YouTube Clone Backend Running ");
});

// Start the Express server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
