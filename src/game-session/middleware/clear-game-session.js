import cookieConfig from "../../configs/cookie-config.js";

const clearGameSessionCookie = (req, res, next) => {
  res.clearCookie("game_session", cookieConfig);

  next();
};

export default clearGameSessionCookie;
