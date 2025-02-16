const { PrismaClient } = require("@prisma/client");
const constants = require("../constants/index.js").default;

const databaseUrl =
  constants.env.NODE_ENV === "test"
    ? constants.env.TEST_DATABASE_URL
    : constants.env.DATABASE_URL;

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: databaseUrl,
    },
  },
});

exports.client = prisma;
