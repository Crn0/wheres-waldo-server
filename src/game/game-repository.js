import query from "../db/query.js";

const createOne = query.createOne("sessions");
const findMany = query.findMany("game");
const findUnique = query.findUnique("game");

const createGame = async (dataDTO, selectDTO) => createOne(dataDTO, selectDTO);

const getGame = async (queryDTO) => findUnique(queryDTO);

const getGames = async (queryDTO) => findMany(queryDTO);

export default {
  createGame,
  getGame,
  getGames,
};
