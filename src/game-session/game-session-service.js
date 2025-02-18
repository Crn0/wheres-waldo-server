import { Prisma } from "@prisma/client";
import jwt from "jsonwebtoken";
import query from "../db/query.js";
import constants from "../constants/index.js";
import gameService from "../game/game-service.js";
import repository from "./game-session-repository.js";
import sessionCharacterService from "../game-session-character/session-character.service.js";
import isCharacterValidPosition from "./valid-character-position.js";
import queryOptions from "./query-options.js";
import httpStatus from "../constants/http-status.js";
import APIError from "../errors/api-error.js";

const underScoreToCamelCase = (obj) => {
  const entries = Object.entries(obj);

  return Object.fromEntries(
    entries.map(([key, value]) => {
      const hasUnderScore = key.includes("_");
      if (hasUnderScore) {
        const transFormKey = key
          .split("_")
          .map((k, i) => {
            if (i === 0) return k;
            return k[0].toUpperCase() + k.slice(1);
          })
          .join("");
        return [transFormKey, value];
      }

      return [key, value];
    })
  );
};

const generateToken = (id, expiresIn) =>
  jwt.sign(
    {
      id,
    },
    constants.env.GAME_TOKEN_SECRET,
    {
      expiresIn,
    }
  );

const createGameSession = async (title, selecOpsDTO) => {
  try {
    const [error, game] = await gameService.getGameByTitle(title, {
      select: {
        id: true,
        targets: {
          select: {
            name: true,
            sprite: {
              select: {
                id: true,
              },
            },
            coordinates: true,
          },
        },
      },
    });

    if (error) {
      throw error;
    }

    const sessionCharacters = game.targets.map((character) => ({
      ...character,
      sprite: {
        connect: {
          id: character.sprite.id,
        },
      },
      coordinates: {
        connect: {
          id: character.coordinates.id,
        },
      },
    }));

    const data = {
      data: {
        game: {
          connect: {
            id: game.id,
          },
        },
        player: {
          create: {
            username: "Nameless",
          },
        },
        sessionCharacters: {
          create: sessionCharacters,
        },
      },
    };

    const selectOps =
      typeof selecOpsDTO === "object"
        ? { ...selecOpsDTO }
        : { ...queryOptions };

    if (typeof selecOpsDTO !== "object") {
      selectOps.select.sessionCharacters.select.coordinates = false;
    }

    selectOps.select = {
      ...selectOps.select,
      player: { select: { id: true } },
      sessionCharacters: {
        select: {
          id: true,
          name: true,
          found: true,
          sprite: { select: { url: true, artist: true } },
        },
      },
    };

    const options = {
      ...selectOps,
    };

    const q = await repository.createGameSession(data, options);

    return [null, q];
  } catch (e) {
    return [e, null];
  }
};

const deleteGameSessionById = async (id, selecOpsDTO) => {
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

    const q = await repository.deleteGameSession(options);

    return [null, q];
  } catch (e) {
    if (e.meta.cause === "Record to delete does not exist.")
      return [new APIError(e.meta.cause, httpStatus.NOT_FOUND), null];

    return [e, null];
  }
};

const updateGameSessionEndById = async (id, dataDTO, selecOpsDTO) => {
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

    const q = await repository.updateGameSession(options);

    return [null, q];
  } catch (e) {
    return [e, null];
  }
};

const getGameSessionById = async (id) => {
  try {
    const q = Prisma.sql`
      SELECT gs.id 
             ,gs.session_start AS "sessionStart" 
             ,gs.session_end AS "sessionEnd" 
             ,JSON_BUILD_OBJECT('id', ply.id) AS "player"
             ,JSON_BUILD_OBJECT(
              'id', g.id, 
              'title', g.title,
              'board', JSON_BUILD_OBJECT('url', p.url, 'artist', p.artist)
              ) as game
             ,ARRAY((
                SELECT 
                  JSON_BUILD_OBJECT(
                    'id', sc.id, 
                    'name', sc.name,
                    'found', sc.found,
                    'coordinates', ROW_TO_JSON(c.*), 
                    'sprite', JSON_BUILD_OBJECT('url', p.url, 'artist', p.artist)
                  ) 
                FROM session_characters sc
                LEFT JOIN coordinates c ON sc.coordinate_id = c.id AND sc.found = true
                LEFT JOIN pictures p ON sc.sprite_id = p.id
                WHERE sc.session_id = gs.id
                ORDER BY sc.id ASC
              )) as "sessionCharacters" FROM game_sessions gs
      JOIN games g ON gs.game_id = g.id
      JOIN pictures p ON p.game_id = g.id
      JOIN players ply ON gs.id = ply.session_id


      WHERE gs.id = ${id}
    `;
    const res = await query.queryRaw(q);

    const gameSession = res[0];

    if (!gameSession) {
      throw new APIError("Game session does not exist.", httpStatus.NOT_FOUND);
    }

    gameSession.sessionCharacters = gameSession.sessionCharacters.map((sc) => {
      const scRef = sc;

      if (!sc.coordinates) {
        return { ...scRef };
      }

      delete scRef.coordinates.id;
      delete scRef.coordinates.character_id;
      delete scRef.coordinates.session_character_id;

      return { ...scRef, coordinates: underScoreToCamelCase(sc.coordinates) };
    });

    return [null, gameSession];
  } catch (e) {
    return [e, null];
  }
};

const checkGameSessionAnswer = async (sessionId, characterDTO) => {
  try {
    const [currentCharacterError, currentCharacter] =
      await sessionCharacterService.getSessionCharacter(
        sessionId,
        characterDTO.id
      );

    if (currentCharacterError) throw currentCharacterError;

    if (currentCharacter.found) {
      throw new APIError("Character already found", httpStatus.FORBIDDEN);
    }

    const characterCoords = {
      ...currentCharacter.coordinates,
      width: characterDTO.width,
      height: characterDTO.height,
      currentX: characterDTO.currentX,
      currentY: characterDTO.currentY,
    };

    const isValidPosition = isCharacterValidPosition(characterCoords);

    if (!isValidPosition) {
      throw new APIError(
        "Invalid position. Try again",
        httpStatus.UNPROCESSABLE
      );
    }

    const [sessionCharacterError, sessionCharacterFound] =
      await sessionCharacterService.updateSessionCharacer(
        sessionId,
        currentCharacter.id,
        {
          found: true,
        },
        {
          select: {
            id: true,
            name: true,
            found: true,
            coordinates: {
              select: {
                normalizedX: true,
                normalizedY: true,
              },
            },
            sprite: {
              select: {
                url: true,
              },
            },
          },
        }
      );

    if (sessionCharacterError) throw sessionCharacterError;

    return [null, sessionCharacterFound];
  } catch (e) {
    return [e, null];
  }
};

const gameOver = async (sessionId) => {
  try {
    const [errorTargets, targets] =
      await sessionCharacterService.getSessionCharactersByGameSession(
        sessionId,
        {
          select: {
            found: true,
          },
        }
      );

    if (errorTargets) throw errorTargets;

    const allTargetsFound = targets.every((target) => target.found === true);

    if (allTargetsFound) {
      await updateGameSessionEndById(sessionId, { sessionEnd: new Date() });
    }

    return [null, null];
  } catch (e) {
    return [e, null];
  }
};

export default {
  createGameSession,
  deleteGameSessionById,
  getGameSessionById,
  generateToken,
  checkGameSessionAnswer,
  gameOver,
};
