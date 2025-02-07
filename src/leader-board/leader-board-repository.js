import query from "../db/query.js";

const createOne = query.createOne("leaderboard");
const deleteOne = query.deleteOne("leaderboard");
const updateOne = query.updateOne("leaderboard");
const findUnique = query.findUnique("leaderboard");
const findMany = query.findMany("leaderboard");

const createLeaderBoard = async (dataDTO, selecOpsDTO) =>
  createOne(dataDTO, selecOpsDTO);

const deleteLeaderBoard = async (queryDTO) => deleteOne(queryDTO);

const updateLeaderBoard = async (queryDTO) => updateOne(queryDTO);

const getLeaderBoard = async (queryDTO) => findUnique(queryDTO);

const getLeaderBoards = async (queryDTO) => findMany(queryDTO);

export default {
  createLeaderBoard,
  deleteLeaderBoard,
  updateLeaderBoard,
  getLeaderBoard,
  getLeaderBoards,
};
