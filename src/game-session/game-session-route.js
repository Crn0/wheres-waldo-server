import { Router } from "express";
import controller from "./game-session-controller.js";
import middleware from "./middleware/index.js";
import validation from "./validation/index.js";

const router = Router();

router.use(middleware.readGameSession);

router.get(
  "/current-game",
  middleware.gameSessionCookieError,
  controller.currentGameSession
);

router.post(
  "/:sessionId/answer",
  middleware.gameSessionCookieError,
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
  middleware.gameSessionCookieError,
  controller.deleteGameSession
);

export default router;
