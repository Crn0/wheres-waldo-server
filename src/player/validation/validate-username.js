import { body } from "express-validator";

const validateUsername = () =>
  body("username").trim().notEmpty().withMessage("Username cannot be empty");

export default validateUsername;
