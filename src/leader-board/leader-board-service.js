import { Prisma } from "@prisma/client";
import query from "../db/query.js";
import repository from "./leader-board-repository.js";
import gameService from "../game/game-service.js";
import queryOptions from "./query-options.js";
import httpStatus from "../constants/http-status.js";
import APIError from "../errors/api-error.js";

const createLeaderBoard = async (gameId, selecOpsDTO) => {
  try {
    const selectOps =
      typeof selecOpsDTO === "object"
        ? { ...selecOpsDTO }
        : { ...queryOptions };

    const [gameError] = await gameService.getGameById(gameId);

    if (gameError) throw gameError;

    const q = await repository.createLeaderBoard(
      {
        data: {
          game: {
            connect: {
              id: gameId,
            },
          },
        },
      },
      selectOps
    );
    return [null, q];
  } catch (e) {
    return [e, null];
  }
};

const getLeaderBoardById = async (id) => {
  try {
    const q = Prisma.sql`
        SELECT
            g.*
            ,ARRAY((
                SELECT 
                    JSON_BUILD_OBJECT(
                        'id', ply.id
                        ,'time', EXTRACT(EPOCH FROM (gs.session_end::timestamp - gs.session_start::timestamp)) 
                        ,'username', ply.username
                        ,'sessionStart', gs.session_start) 
                FROM game_sessions gs
                JOIN players ply ON gs.id = ply.session_id
                WHERE gs.session_end IS NOT NULL AND gs.game_id = g.id
                ORDER BY EXTRACT(EPOCH FROM (gs.session_end::timestamp - gs.session_start::timestamp)) ASC
            )) AS players
        FROM leaderboards ld
        JOIN games g ON ld.game_id =  g.id
        WHERE ld.id = ${id}
    `;

    const res = await query.queryRaw(q);

    if (res.length === 0) {
      throw new APIError("Leader-Board does not exist", httpStatus.NOT_FOUND);
    }

    return [null, res[0]];
  } catch (e) {
    return [e, null];
  }
};

const getLeaderBoards = async (selecOpsDTO) => {
  try {
    const options =
      typeof selecOpsDTO === "object"
        ? { ...selecOpsDTO }
        : { ...queryOptions };

    const q = await repository.getLeaderBoards(options);

    return [null, q];
  } catch (e) {
    return [e, null];
  }
};

export default {
  createLeaderBoard,
  getLeaderBoardById,
  getLeaderBoards,
};
