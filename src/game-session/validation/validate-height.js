import { body } from "express-validator";

const validateHeight = () =>
  body("height")
    .trim()
    .notEmpty()
    .withMessage("Height axis must not be empty")
    .isNumeric()
    .withMessage("Height axist must be numeric");

export default validateHeight;
