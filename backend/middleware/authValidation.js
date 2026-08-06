// Validate signup request data
export const validateSignup = (req, res, next) => {
  // Get user details from request body
  const { name, email, password } = req.body;

  // Check if any required field is missing
  if (!name || !email || !password) {
    return res.status(400).json({
      message: "All fields are required",
    });
  }

  // Continue to the next middleware or controller
  next();
};



// Middleware to validate login request

export const validateLogin = (req, res, next) => {
  // Extract email and password from request body
  const { email, password } = req.body;

  // Check if email and password are provided
  if (!email || !password) {
    return res.status(400).json({
      message: "Email and password are required",
    });
  }

  // Move to the next middleware/controller
  next();
};

