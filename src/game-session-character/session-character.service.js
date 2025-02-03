import repository from "./session-character.repository.js";
import queryOptions from "./query-options.js";
import httpStatus from "../constants/http-status.js";
import APIError from "../errors/api-error.js";

const getSessionCharacter = async (sessionId, characterId, selecOpsDTO) => {
  try {
    const selectOps =
      typeof selecOpsDTO === "object"
        ? { ...selecOpsDTO }
        : { ...queryOptions };

    const options = {
      ...selectOps,
      where: {
        sessionId,
        id: characterId,
      },
    };

    const q = await repository.getSessionCharacter(options);

    if (!q) {
      throw APIError("Character does not exist", httpStatus.NOT_FOUND);
    }

    return [null, q];
  } catch (e) {
    return [e, null];
  }
};

const getSessionCharactersByGameSession = async (sessionId, selecOpsDTO) => {
  try {
    const selectOps =
      typeof selecOpsDTO === "object"
        ? { ...selecOpsDTO }
        : { ...queryOptions };

    const options = {
      ...selectOps,
      where: {
        sessionId,
      },
    };

    const q = await repository.getSessionCharacters(options);

    if (!q) {
      throw APIError("Character does not exist", httpStatus.NOT_FOUND);
    }

    return [null, q];
  } catch (e) {
    return [e, null];
  }
};
const updateSessionCharacer = async (
  sessionId,
  characterId,
  dataDTO,
  selecOpsDTO
) => {
  try {
    const selectOps =
      typeof selecOpsDTO === "object"
        ? { ...selecOpsDTO }
        : { ...queryOptions };

    const options = {
      ...selectOps,
      where: {
        sessionId,
        id: characterId,
      },
      data: {
        ...dataDTO,
      },
    };

    const q = await repository.updateSessionCharacter(options);

    return [null, q];
  } catch (e) {
    return [e, null];
  }
};

export default {
  getSessionCharacter,
  getSessionCharactersByGameSession,
  updateSessionCharacer,
};
