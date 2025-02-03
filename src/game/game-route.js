import { Router } from "express";
import controller from "./game-controller.js";
import middleware from "./middleware/index.js";
import validation from "./validation/index.js";

const router = Router();

router.get("/", controller.gameCollection);
router.get(
  "/:title",
  validation.paramTitle(),
  middleware.validationError,
  controller.game
);

router.post(
  "/:title/game-sessions",
  middleware.ongoingGame,
  validation.paramTitle(),
  middleware.validationError,
  controller.createGameSession
);

export default router;
