import { Router } from "express";
import controller from "./player-controller.js";
import middleware from "./middleware/index.js";
import validation from "./validation/index.js";

const router = Router();

router.put(
  "/:playerId",
  validation.validatePlayerId(),
  validation.validateUsername(),
  middleware.validationError,
  controller.updateUsername,
  middleware.clearGameSessionCookie,
  middleware.sendJsonData
);

export default router;
