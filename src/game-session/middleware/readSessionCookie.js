import jwt from "jsonwebtoken";
import constants from "../../constants/index.js";
import APIError from "../../errors/api-error.js";
import httpStatus from "../../constants/http-status.js";

const readGameSession = (req, res, next) => {
  const gameSession = req.cookies.game_session;

  if (!gameSession) {
    throw new APIError(
      "There's no ongoing game session",
      httpStatus.UNPROCESSABLE
    );
  }

  return jwt.verify(
    gameSession,
    constants.env.GAME_TOKEN_SECRET,
    async (err, decoded) => {
      req.session = {
        id: decoded.id,
      };

      if (err) {
        req.session.error = new APIError(
          "Game session expired",
          httpStatus.UNAUTHORIZED
        );

        return next();
      }

      return next();
    }
  );
};

export default readGameSession;
