import jwt from "jsonwebtoken";
import constants from "../../constants/index.js";
import APIError from "../../errors/api-error.js";
import httpStatus from "../../constants/http-status.js";

const ongoingGame = (req, res, next) => {
  const gameSession = req.cookies.game_session;

  if (!gameSession) return next();

  return jwt.verify(gameSession, constants.env.GAME_TOKEN_SECRET, (err, _) => {
    if (err) {
      res.clearCookie("game_session");
      return next();
    }

    return next(
      new APIError("There's an ongoing game session", httpStatus.UNPROCESSABLE)
    );
  });
};

export default ongoingGame;
