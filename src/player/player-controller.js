import asyncHandler from "express-async-handler";
import service from "./player-service.js";
import httpStatus from "../constants/http-status.js";

const updateUsername = asyncHandler(async (req, res, next) => {
  const playerId = Number(req.params.playerId);
  const { username } = req.body;

  const [error, updatePlayer] = await service.updateUsername(playerId, {
    username,
  });

  if (error) throw error;

  req.data = {
    status: httpStatus.OK,
    body: updatePlayer,
  };

  next();
});

export default {
  updateUsername,
};
