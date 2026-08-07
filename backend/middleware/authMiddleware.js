import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { errorResponse } from "../utils/response.js";


// Verify user authentication
const authMiddleware = async (req, res, next) => {
  try {
    // Get authorization header
    const authHeader = req.headers.authorization;

    // Check if token is provided
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return errorResponse(res, 401, "Access denied. No token provided");
    }

    // Extract token from the authorization header
    const token = authHeader.split(" ")[1];

    // Verify JWT token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Retrieve the authenticated user's information from the database
    // using the user ID stored in the JWT. Do not include the password.
    const user = await User.findById(decoded.userId).select("-password");

    // Check if user exists
    if (!user) {
      return errorResponse(res, 404, "User not found");
    }

    // Attach user to request object
    req.user = user;

    // Move to the next middleware/controller
    next();
  } catch (error) {
    console.log(error);

    return errorResponse(res, 401, "Invalid or expired token");
  }
};

export default authMiddleware;
