import { param } from "express-validator";

const validateGameSessionId = () =>
  param("sessionId")
    .trim()
    .isNumeric()
    .withMessage("Id must be a number")
    .escape();

export default validateGameSessionId;
