import query from "../db/query.js";

const createOne = query.createOne("gameSession");
const deleteOne = query.deleteOne("gameSession");
const updateOne = query.updateOne("gameSession");
const findUnique = query.findUnique("gameSession");

const createGameSession = async (dataDTO, selecOpsDTO) =>
  createOne(dataDTO, selecOpsDTO);

const deleteGameSession = async (queryDTO) => deleteOne(queryDTO);

const updateGameSession = async (queryDTO) => updateOne(queryDTO);

const getGameSession = async (queryDTO) => findUnique(queryDTO);

export default {
  createGameSession,
  deleteGameSession,
  updateGameSession,
  getGameSession,
};
