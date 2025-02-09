import { body } from "express-validator";

const validateWidth = () =>
  body("width")
    .trim()
    .notEmpty()
    .withMessage("Width axis must not be empty")
    .isNumeric()
    .withMessage("Width axist must be numeric");

export default validateWidth;
