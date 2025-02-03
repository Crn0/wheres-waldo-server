import repository from "./player-repository.js";
import queryOptions from "./query-options.js";
import httpStatus from "../constants/http-status.js";
import APIError from "../errors/api-error.js";

const updateUsername = async (id, dataDTO, selecOpsDTO) => {
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
      data: {
        ...dataDTO,
      },
    };

    const playerExist = await repository.getPlayer({
      where: {
        id,
      },
      select: {
        id: true,
      },
    });

    if (playerExist === null) {
      throw new APIError("Player does not exist.", httpStatus.NOT_FOUND);
    }

    const q = await repository.updatePlayer(options);

    return [null, q];
  } catch (e) {
    return [e, null];
  }
};

export default {
  updateUsername,
};
