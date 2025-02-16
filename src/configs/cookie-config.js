import constants from "../constants/index.js";

const cookieConfig = {
  maxAge: 24 * 60 * 60 * 1000, // one day
  httpOnly: true,
  secure: constants.env.NODE_ENV === "prod",
  sameSite: constants.env.NODE_ENV === "prod" ? "none" : "lax",
  credentials: true,
};

export default cookieConfig;
