import constants from "../constants/index.js";

const cookieConfig = {
  maxAge: 24 * 60 * 60 * 1000, // one day
  httpOnly: true,
  secure: constants.NODE_ENV === "prod",
  sameSite: constants.NODE_ENV === "prod" ? "none" : "lax",
};

export default cookieConfig;
