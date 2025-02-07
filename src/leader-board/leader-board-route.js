import { Router } from "express";
import controller from "./leader-board-controller.js";
import middleware from "./middleware/index.js";
import validation from "./validation/index.js";

const router = Router();

router.get("/", controller.leaderBoardCollection);
router.get(
  "/:id",
  validation.validateId(),
  middleware.validationError,
  controller.leaderBoard
);

export default router;
