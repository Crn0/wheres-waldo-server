const clearGameSessionCookie = (req, res, next) => {
  res.clearCookie("game_session");

  next();
};

export default clearGameSessionCookie;
