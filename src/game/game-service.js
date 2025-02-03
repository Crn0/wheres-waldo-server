import repository from "./game-repository.js";
import queryOptions from "./query-options.js";
import APIError from "../errors/api-error.js";
import httpStatus from "../constants/http-status.js";

const createGame = async (gameDTO, selecOpsDTO) => {
  try {
    const selectOps =
      typeof selecOpsDTO === "object"
        ? { ...selecOpsDTO }
        : { ...queryOptions };

    const q = await repository.createGame(gameDTO, selectOps);

    return [null, q];
  } catch (e) {
    return [e, null];
  }
};

const getGameByTitle = async (title, selecOpsDTO) => {
  try {
    const selectOps =
      typeof selecOpsDTO === "object"
        ? { ...selecOpsDTO }
        : { ...queryOptions };

    const options = {
      ...selectOps,
      where: {
        title,
      },
    };

    const q = await repository.getGame(options);

    if (!q) {
      throw new APIError("Game does not exist", httpStatus.NOT_FOUND);
    }

    return [null, q];
  } catch (e) {
    return [e, null];
  }
};

const getGameById = async (id, selecOpsDTO) => {
  try {
    const selectOps =
      typeof selecOpsDTO === "object"
        ? { ...selecOpsDTO }
        : { ...queryOptions };

    const options = {
      ...selectOps,
      where: {
        id,
      },
    };

    const q = await repository.getGame(options);

    if (!q) {
      throw new APIError("Game does not exist", httpStatus.NOT_FOUND);
    }

    return [null, q];
  } catch (e) {
    return [e, null];
  }
};

const getGames = async (selecOpsDTO) => {
  try {
    const options =
      typeof selecOpsDTO === "object"
        ? { ...selecOpsDTO }
        : { ...queryOptions };

    const q = await repository.getGames(options);

    return [null, q];
  } catch (e) {
    return [e, null];
  }
};

export default {
  createGame,
  getGameByTitle,
  getGameById,
  getGames,
};
