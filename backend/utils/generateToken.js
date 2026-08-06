import jwt from "jsonwebtoken";

// Genrate JWT token

export default function generateToken(userId) {
  return jwt.sign(
    { userId }, //payload
    process.env.JWT_SECRET, // Secret key
    { expiresIn: "7d" }, // Token validity
  );
}