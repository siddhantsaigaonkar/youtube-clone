// Send success response
// export const successResponse = (res, statusCode, message, data = {}) => {
//   return res.status(statusCode).json({
//     success: true,
//     message,
//     ...data
//   });
// };


export const successResponse = (res, statusCode, message, data = null) => {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
  });
};


// Send error response
export const errorResponse = (res,statusCode,message) => {
  return res.status(statusCode).json({
    success: false,
    message,
  });
}