import constants from "../constants/index.js";

const corsOptions = {
  origin: constants.env.CORS_ORIGINS.split(","),
  methods: constants.env.CORS_METHODS,
  credentials: true,
  optionsSuccessStatus: 200,
};

export default corsOptions;
