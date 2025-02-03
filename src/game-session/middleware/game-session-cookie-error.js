import asyncHandler from "express-async-handler";
import gameSessionService from "../game-session-service.js";

const gameSessionCookieError = asyncHandler(async (req, res, next) => {
  if (!req.session.error) return next();

  const [_, currentSession] = await gameSessionService.getGameSessionById(
    req.session.id
  );

  if (!currentSession?.sessionEnd) {
    await gameSessionService.deleteGameSessionById(req.session.id);
  }

  res.clearCookie("game_session");

  throw req.session.error;
});

export default gameSessionCookieError;
