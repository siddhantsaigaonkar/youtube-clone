import bycrypt from "bcryptjs";
import User from "../models/User.js";
import genrateToken from "../utils/generateToken.js";
import { successResponse,errorResponse } from "../utils/response.js";



export const signup = async(req,res) => {
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

    const token = genrateToken(user._id)

    // send success response
    return successResponse(res,201,"user registered successfully",{token,user:{id:user._id,name:user.name,email:user.email,profilePic:user.profilePic}})
  } catch (error) {
  console.error(error);

  return errorResponse(res, 500, "Internal Server Error");
 } 
}