import bcrypt from "bcryptjs";
import User from "../models/User.js";
import generateToken from "../utils/generateToken.js";
import { successResponse, errorResponse } from "../utils/response.js";
import Channel from "../models/channelModel.js";



// signup controller

export const signup = async (req, res) => {
  try {
    // Get user data from request body
    const { name, email, password } = req.body;

    // Check if the email is already registered
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return errorResponse(res, 400, "User already exists");
    }

    // Hash the password before saving
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    // Genrate JWT Token

    const token = generateToken(user._id);

    // send success response
    return successResponse(res, 201, "user registered successfully", {
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        profilePic: user.profilePic,
      },
    });
  } catch (error) {
    console.error(error);

    return errorResponse(res, 500, "Internal Server Error");
  }
};


// signin controller

export const signin = async (req, res) => {
  try {
    // Get email and password from request body
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ email });

    // Check if user exists
    if (!user) {
      return errorResponse(res, 404, "User not found");
    }
    // Compare entered password with hashed password
    const isPasswordMatch = await bcrypt.compare(password, user.password);

    // Check if password is correct
    if (!isPasswordMatch) {
      return errorResponse(res, 401, "Invalid email or password");
    }

    // Generate JWT token
    const token = generateToken(user._id);
    console.log(token);

    // Send success response
    return successResponse(res, 200, "Login successful", {
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        profilePic: user.profilePic,
      },
    });
  } catch (error) {
    console.log(error);

    return errorResponse(res, 500, "Something went wrong while logging in");
  }
};



// Logout the currently logged-in user
export const signout = async (req, res) => {
  try {
    // Send a successful logout response
    return successResponse(res, 200, "Logout successful");
  } catch (error) {
    // Log the error for debugging
    console.error("Logout error:", error);

    // Send error response to the client
    return errorResponse(res, 500, "Failed to logout");
  }
};

// Get the profile of the currently logged-in user
// Get the profile of the currently logged-in user
export const getCurrentUser = async (req, res) => {
  try {
    // Get authenticated user
    const user = req.user;

    // Find the channel owned by this user
    const channel = await Channel.findOne({
      owner: user._id,
    });

    // Convert user document to normal JavaScript object
    const data = user.toObject();

    // Add channel to user data
    data.channel = channel;

    console.log("Current user:", data);

    return successResponse(
      res,
      200,
      "User profile fetched successfully",
      data
    );
  } catch (error) {
    console.error("Error fetching user profile:", error);

    return errorResponse(
      res,
      500,
      "Something went wrong while fetching the user profile"
    );
  }
};