// Import Express framework
import express from "express";

// Create an Express application
const app = express();

// Define the server port
const PORT = 5000;

// Test route to check whether the backend is running
app.get("/", (req, res) => {
  res.send("YouTube Clone Backend Running 🚀");
});

// Start the Express server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
