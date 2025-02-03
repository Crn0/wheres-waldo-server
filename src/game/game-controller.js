import asyncHandler from "express-async-handler";
import service from "./game-service.js";
import gameSessionService from "../game-session/game-session-service.js";
import httpStatus from "../constants/http-status.js";
import queryOptions from "./query-options.js";
import cookieConfig from "../configs/cookie-config.js";

const game = asyncHandler(async (req, res, _) => {
  const { title } = req.params;

  const [error, currentGame] = await service.getGameByTitle(title);

  if (error) throw error;

  return res.status(httpStatus.OK).json(currentGame);
});

const gameCollection = asyncHandler(async (req, res, _) => {
  const [error, games] = await service.getGames({
    select: {
      ...queryOptions.select,
      targets: false,
    },
  });

  if (error) throw error;

  return res.status(httpStatus.OK).json(games);
});

const createGameSession = asyncHandler(async (req, res, _) => {
  const { title } = req.params;

  const [error, gameSession] =
    await gameSessionService.createGameSession(title);

  if (error) throw error;

  const sessionToken = gameSessionService.generateToken(gameSession.id, "1d");

  res.cookie("game_session", sessionToken, cookieConfig);

  return res.status(httpStatus.CREATED).json(gameSession);
});

export default {
  game,
  gameCollection,
  createGameSession,
};
