import { body } from "express-validator";

const validateCurrentX = () =>
  body("currentX")
    .trim()
    .notEmpty()
    .withMessage("Current X axis must not be empty")
    .isNumeric()
    .withMessage("Current X axist must be numeric");

export default validateCurrentX;
