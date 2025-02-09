import { Router } from "express";
import controller from "./game-session-controller.js";
import middleware from "./middleware/index.js";
import validation from "./validation/index.js";

const router = Router();

router.get(
  "/current-game",
  middleware.readGameSession,
  middleware.gameSessionCookieError,
  controller.currentGameSession
);

router.post(
  "/:sessionId/answer",
  [
    validation.validateGameSessionId(),
    validation.validateWidth(),
    validation.validateHeight(),
    validation.validateCurrentX(),
    validation.validateCurrentY(),
    validation.validateWidth(),
  ],
  middleware.validationError,
  controller.gameSessionAnswer
);

router.delete(
  "/:sessionId",
  validation.validateGameSessionId(),
  middleware.validationError,
  controller.deleteGameSession
);

export default router;
