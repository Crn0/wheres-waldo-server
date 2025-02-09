import { body } from "express-validator";

const validateCurrentY = () =>
  body("currentY")
    .trim()
    .notEmpty()
    .withMessage("Current Y axis must not be empty")
    .isNumeric()
    .withMessage("Current Y axist must be numeric");

export default validateCurrentY;
