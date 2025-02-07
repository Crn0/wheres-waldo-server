import asyncHandler from "express-async-handler";
import service from "./leader-board-service.js";
import httpStatus from "../constants/http-status.js";

const leaderBoard = asyncHandler(async (req, res, _) => {
  const id = Number(req.params.id);

  const [error, currentLeaderBoard] = await service.getLeaderBoardById(id);

  if (error) throw error;

  return res.status(httpStatus.OK).json(currentLeaderBoard);
});

const leaderBoardCollection = asyncHandler(async (req, res, _) => {
  const [error, leaderBoards] = await service.getLeaderBoards();

  if (error) throw error;

  return res.status(httpStatus.OK).json(leaderBoards);
});

export default {
  leaderBoard,
  leaderBoardCollection,
};
