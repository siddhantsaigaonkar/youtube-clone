// Send success response
export const successResponse = (res, statusCode, message, data = {}) => {
  return res.status(statusCode).json({
    sucess: true,
    message,
    ...data
  });
};


// Send error response
export const errorResponse = (res,statusCode,message) => {
  return res.status(statusCode).json({
    success: false,
    message,
  });
}