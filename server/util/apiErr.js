import { Error } from "mongoose";

class ApiError extends Error {
  constructor(
    statusCode,
    message = "Something went wrong",
    errors = [],
    stack = ""
  ) {
    super(message);
    this.statusCode = statusCode;
    this.data = null;
    this.message = message;
    this.success = false;
    this.errors = errors;

    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

export { ApiError };

// Create a custom error class called ApiError, extending the built-in Error class. This class allows for the creation of error objects with specific properties such as statusCode, message, success, data, and errors. Additionally, it provides a mechanism for capturing stack traces. This class enhances error handling capabilities and improves code readability and maintainability.

// Fix typo in constructor parameter name (statck -> stack).