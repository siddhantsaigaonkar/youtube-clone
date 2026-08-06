// Import mongoose to interact with MongoDB
import mongoose from "mongoose";

/**
 * Connects the application to the MongoDB database.
 * This function will be called before starting the Express server.
 */
const connectDB = async () => {
  try {
    // Connect to MongoDB using the connection string from .env
    await mongoose.connect(process.env.MONGODB_URI);

    console.log("MongoDB Connected Successfully");
  } catch (error) {
    // Print the error if connection fails
    console.error(" MongoDB Connection Failed:", error.message);

    // Stop the application because the database is required
    process.exit(1);
  }
};

// Export the function so it can be used in server.js
export default connectDB;
