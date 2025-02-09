import { body } from "express-validator";

const validateCharacterId = () =>
  body("characterId")
    .trim()
    .notEmpty()
    .withMessage("Character ID must not be empty")
    .isNumeric()
    .withMessage("Character ID axist must be numeric");

export default validateCharacterId;
