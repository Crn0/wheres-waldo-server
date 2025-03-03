import fs from "fs/promises";
import { join } from "path";
import { beforeAll, afterAll } from "vitest";
import client from "../../src/db/client.js";
import constants from "../../src/constants/index.js";
import gameService from "../../src/game/game-service.js";
import leaderBoardService from "../../src/leader-board/leader-board-service.js";
import storageService from "../../src/storage/storage-service.js";

let cleanDb = false;

const createGames = async () => {
  const path = join(import.meta.dirname, "..", "..", "public");

  const boardData = {
    "dragon-island": {
      artist: "@gozz_sss",
    },

    "star-wars": {
      artist: "@UFO78794757",
    },
  };

  const files = await fs.readdir(path);

  return Promise.all(
    files.map(async (file) => {
      const fileName = file.split(".")[0];
      const currentBoard = boardData[fileName];

      if (currentBoard) {
        const data = {
          file: `${path}/${file}`,
          options: {
            folder: `${constants.env.CLOUDINARY_ROOT_FOLDER}/${fileName}`,
            type: "upload",
            resource_type: "image",
            use_filename: true,
            eager: {
              format: "webp",
            },
          },
        };

        const picture = await storageService.upload(data);

        const board = await client.picture.create({
          data: {
            name: fileName,
            url: picture.secure_url,
            artist: currentBoard.artist,
            publicId: picture.public_id,
            version: picture.version,
            resourceType: {
              connectOrCreate: {
                where: {
                  type: picture.resource_type,
                },
                create: {
                  type: picture.resource_type,
                },
              },
            },
            deliveryType: {
              connectOrCreate: {
                where: {
                  type: picture.type,
                },
                create: {
                  type: picture.type,
                },
              },
            },
          },
        });

        const [gameError, game] = await gameService.createGame({
          data: {
            title: fileName,
            board: {
              connect: {
                id: board.id,
              },
            },
          },
        });

        if (gameError) throw gameError;

        await leaderBoardService.createLeaderBoard(game.id);

        return game;
      }

      return null;
    })
  );
};

const createCharacters = async () => {
  const path = join(import.meta.dirname, "..", "..", "public");

  const charactersData = {
    "raft-man": {
      filePath: (file) => `${path}/${file}`,
      name: "raft-man",
      game: "dragon-island",
      coordinates: {
        normalizedX: 0.05231607629427793,
        normalizedY: 0.421835160460888,
        leftX: 15,
        rightX: 23,
        leftY: 21,
        rightY: 27,
      },
    },

    "sleeping-dragon": {
      filePath: (file) => `${path}/${file}`,
      name: "sleeping-dragon",
      game: "dragon-island",
      coordinates: {
        normalizedX: 0.8811989100817439,
        normalizedY: 0.5187893266730615,
        leftX: 19,
        rightX: 23,
        leftY: 5,
        rightY: 10,
      },
    },

    cats: {
      filePath: (file) => `${path}/${file}`,
      name: "cats",
      game: "dragon-island",
      coordinates: {
        normalizedX: 0.3634877384196185,
        normalizedY: 0.23461772814749124,
        leftX: 20,
        rightX: 5,
        leftY: 11,
        rightY: 9,
      },
    },

    superman: {
      filePath: (file) => `${path}/${file}`,
      name: "superman",
      game: "star-wars",
      coordinates: {
        normalizedX: 0.11149864131081035,
        normalizedY: 0.25588784808377046,
        leftX: 67,
        rightX: 32,
        leftY: 1,
        rightY: 46,
      },
    },

    "eye-of-sauron": {
      filePath: (file) => `${path}/${file}`,
      name: "eye-of-sauron",
      game: "star-wars",
      coordinates: {
        normalizedX: 0.8877929450608072,
        normalizedY: 0.2011018548084556,
        leftX: 37,
        rightX: 34,
        leftY: 1,
        rightY: 26,
      },
    },

    "hooded-bear": {
      filePath: (file) => `${path}/${file}`,
      name: "hooded-bear",
      game: "star-wars",
      coordinates: {
        normalizedX: 0.3986376154391875,
        normalizedY: 0.748487428847188,
        leftX: 22,
        rightX: 20,
        leftY: 9,
        rightY: 26,
      },
    },
  };

  const files = await fs.readdir(path);

  return Promise.all(
    files.map(async (file) => {
      const fileName = file.split(".")[0];
      const currentCharacter = charactersData[fileName];

      if (currentCharacter) {
        const fileDto = {
          file: currentCharacter.filePath(file),
          options: {
            folder: `${constants.env.CLOUDINARY_ROOT_FOLDER}/${currentCharacter.game}`,
            type: "upload",
            resource_type: "image",
            use_filename: true,
            eager: {
              format: "webp",
            },
          },
        };

        const picture = await storageService.upload(fileDto);

        const sprite = await client.picture.create({
          data: {
            name: currentCharacter.name,
            url: picture.secure_url,
            artist: "@gozz_sss",
            publicId: picture.public_id,
            version: picture.version,
            resourceType: {
              connectOrCreate: {
                where: {
                  type: picture.resource_type,
                },
                create: {
                  type: picture.resource_type,
                },
              },
            },
            deliveryType: {
              connectOrCreate: {
                where: {
                  type: picture.type,
                },
                create: {
                  type: picture.type,
                },
              },
            },
          },
        });

        const character = await client.character.create({
          data: {
            name: currentCharacter.name,
            sprite: {
              connect: {
                id: sprite.id,
              },
            },
            coordinates: {
              create: {
                ...currentCharacter.coordinates,
              },
            },
            game: {
              connect: {
                title: currentCharacter.game,
              },
            },
          },
        });

        return character;
      }

      return null;
    })
  );
};

const init = async () => {
  try {
    const [_, games] = await gameService.getGames();

    if (games.length) return;

    cleanDb = true;

    await createGames();
    await createCharacters();
  } catch (e) {
    console.log(e);
  }
};

const cleanUp = async () => {
  try {
    if (cleanDb) return;

    const [gamesError, games] = await gameService.getGames();

    if (gamesError) throw gamesError;

    await gameService.deleteGames();

    await Promise.all(
      games.map((g) =>
        storageService.destroyFilesByFolder(
          `${constants.env.CLOUDINARY_ROOT_FOLDER}/${g.title}`
        )
      )
    );
  } catch (e) {
    console.log(e);
  }
};

beforeAll(async () => {
  //   await init();
});

afterAll(async () => {
  //   await cleanUp();
});
