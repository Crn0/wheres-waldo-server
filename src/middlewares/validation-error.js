import asyncHandler from "express-async-handler";
import { validationResult } from "express-validator";
import httpStatus from "../constants/http-status.js";
import FieldError from "../errors/field-error.js";

const validationError = asyncHandler((req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const errorFields = errors.array().map((err) => {
      const { type, msg: message, path: field } = err;

      return {
        type,
        field,
        message,
      };
    });

    throw new FieldError(
      "Validation Error",
      errorFields,
      httpStatus.UNPROCESSABLE
    );
  }

  next();
});

export default validationError;
