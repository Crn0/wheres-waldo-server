import BaseError from "./base-error.js";

class FieldError extends BaseError {
  constructor(
    message,
    errors,
    httpCode = 422,
    name = "Validation Error",
    isOperational = true
  ) {
    super(message, httpCode, name, errors, isOperational);
  }
}

export default FieldError;
