import query from "../db/query.js";

const createOne = query.createOne("player");
const deleteOne = query.deleteOne("player");
const updateOne = query.updateOne("player");
const findUnique = query.findUnique("player");

const createPlayer = async (dataDTO, selecOpsDTO) =>
  createOne(dataDTO, selecOpsDTO);

const deletePlayer = async (queryDTO) => deleteOne(queryDTO);

const updatePlayer = async (queryDTO) => updateOne(queryDTO);

const getPlayer = async (queryDTO) => findUnique(queryDTO);

export default {
  createPlayer,
  deletePlayer,
  updatePlayer,
  getPlayer,
};
