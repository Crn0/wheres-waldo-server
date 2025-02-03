import { param } from "express-validator";

const validatePlayerId = () =>
  param("playerId").isNumeric().withMessage("Player ID must be a number");

export default validatePlayerId;
