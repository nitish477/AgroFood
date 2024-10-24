import { config } from "../config/config.js"; // Import configuration settings from the config file

// Define the global error handler middleware function
const globalErrorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500; 

  return res.status(statusCode).json({
    // Send a JSON response with the error details
    message: err.message, // The error message
    errorStack: config.env === "development" ? err.stack : "", 
  });
};

export default globalErrorHandler;