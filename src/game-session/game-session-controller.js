import asyncHandler from "express-async-handler";
import service from "./game-session-service.js";
import httpStatus from "../constants/http-status.js";

const currentGameSession = asyncHandler(async (req, res, _) => {
  const sessionId = Number(req.session.id);

  const [error, currentSession] = await service.getGameSessionById(sessionId);

  if (error) throw error;

  return res.status(httpStatus.OK).json(currentSession);
});

const deleteGameSession = asyncHandler(async (req, res, _) => {
  const sessionId = Number(req.params.sessionId);

  const [error] = await service.deleteGameSessionById(sessionId);

  if (error) throw error;

  res.clearCookie("game_session");

  return res.sendStatus(httpStatus.NO_CONTENT);
});

const gameSessionAnswer = asyncHandler(async (req, res, _) => {
  const sessionId = Number(req.params.sessionId);
  const { width, height, currentY, currentX, characterId } = req.body;

  const characterDTO = {
    width,
    height,
    currentX,
    currentY,
    id: Number(characterId),
  };

  const [error, sessionAnswer] = await service.checkGameSessionAnswer(
    sessionId,
    characterDTO
  );

  if (error) throw error;

  await service.gameOver(sessionId);

  return res.status(httpStatus.OK).json(sessionAnswer);
});

export default {
  currentGameSession,
  deleteGameSession,
  gameSessionAnswer,
};
