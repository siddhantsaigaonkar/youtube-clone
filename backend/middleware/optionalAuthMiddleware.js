import jwt from "jsonwebtoken";
import User from "../models/User.js";


// Check authentication only when a token is provided
// If there is no token, allow the request as a guest
const optionalAuthMiddleware = async (req, res, next) => {
  try {
    // Get authorization header
    const authHeader = req.headers.authorization;

    // If no token is provided,
    // treat the user as a guest
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      req.user = null;

      // Continue to the controller
      return next();
    }

    // Extract token from:
    // Bearer TOKEN
    const token = authHeader.split(" ")[1];

    // Verify JWT token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Find the user from the decoded user ID
    // Do not return the password
    const user = await User.findById(decoded.userId).select("-password");

    // If user doesn't exist,
    // treat the request as a guest
    if (!user) {
      req.user = null;

      return next();
    }

    // Attach authenticated user to request
    req.user = user;

    // Continue to controller
    next();
  } catch (error) {
    // Invalid or expired token
    // Treat the user as a guest instead of blocking the request
    req.user = null;

    // Continue to controller
    next();
  }
};

export default optionalAuthMiddleware;
