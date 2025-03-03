import query from "../db/query.js";

const createOne = query.createOne("game");
const findMany = query.findMany("game");
const findUnique = query.findUnique("game");
const deleteOne = query.deleteOne("game");
const deleteMany = query.deleteMany("game");

const createGame = async (dataDTO, selectDTO) => createOne(dataDTO, selectDTO);

const getGame = async (queryDTO) => findUnique(queryDTO);

const getGames = async (queryDTO) => findMany(queryDTO);

const deleteGame = async (queryDTO) => deleteOne(queryDTO);
const deleteGames = async (queryDTO) => deleteMany(queryDTO);

export default {
  createGame,
  getGame,
  getGames,
  deleteGame,
  deleteGames,
};
