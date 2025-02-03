import { param } from "express-validator";

const paramTitle = () =>
  param("title").trim().notEmpty().withMessage("The game title is required");

export default paramTitle;
