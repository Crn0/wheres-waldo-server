import { param } from "express-validator";

const validateId = () =>
  param("id").trim().isNumeric().withMessage("Id must be a number");

export default validateId;
