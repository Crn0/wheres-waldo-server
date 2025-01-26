import { join } from "path";
import client from "./client.js";
import constants from "../constants/index.js";
import storageService from "../storage/storage-service.js";
import gameService from "../game/game-service.js";

// TODO(DONE: update sleeping-dragon coordinates
// normalizedX: 0.8811989100817439,
// normalizedY: 0.5187893266730615,
// leftX: 19,
// rightX: 23,
// leftY: 5,
// rightY: 10,

const createGameBoard = async () => {
  const path = join(
    import.meta.dirname,
    "..",
    "..",
    "public",
    "dragon-island-wheres-waldo.webp"
  );

  const file = {
    file: path,
    options: {
      folder: `${constants.env.CLOUDINARY_ROOT_FOLDER}/dragon-island`,
      type: "upload",
      resource_type: "image",
      use_filename: true,
      eager: {
        format: "webp",
      },
    },
  };

  const picture = await storageService.upload(file);
  const board = await client.picture.create({
    data: {
      name: "dragon-island-wheres-waldo",
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

  return board;
};

const createGame = async () => {
  const game = await client.game.create({
    data: {
      title: "dragon-island",
      board: {
        connect: {
          id: 1,
        },
      },
    },
  });

  return game;
};

const createCharacters = async () => {
  const path = join(import.meta.dirname, "..", "..", "public");
  const files = [
    {
      name: "raft-man.png",
      coordinates: {
        create: {
          normalizedX: 0.05231607629427793,
          normalizedY: 0.421835160460888,
          leftX: 15,
          rightX: 23,
          leftY: 21,
          rightY: 27,
        },
      },
    },
    {
      name: "cats.png",
      coordinates: {
        create: {
          normalizedX: 0.3634877384196185,
          normalizedY: 0.23461772814749124,
          leftX: 20,
          rightX: 5,
          leftY: 11,
          rightY: 9,
        },
      },
    },
    {
      name: "sleeping-dragon.png",
      coordinates: {
        create: {
          normalizedX: 0.8811989100817439,
          normalizedY: 0.5187893266730615,
          leftX: 19,
          rightX: 23,
          leftY: 5,
          rightY: 10,
        },
      },
    },
  ];

  const characters = files.map(async (file) => {
    const filePath = join(path, file.name);
    const fileDto = {
      file: filePath,
      options: {
        folder: `${constants.env.CLOUDINARY_ROOT_FOLDER}/dragon-island`,
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
        name: file.name.split(".")[0],
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
        name: file.name.split(".")[0],
        sprite: {
          connect: {
            id: sprite.id,
          },
        },
        coordinates: { ...file.coordinates },
        game: {
          connect: {
            title: "dragon-island",
          },
        },
      },
    });

    return character;
  });

  return Promise.all(characters);
};

const createGameSession = async () => {
  const games = await client.game.findMany({
    include: {
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

  const sessionCharacters = games[0].targets.map((character) => ({
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

  const session = await client.gameSession.create({
    data: {
      game: {
        connect: {
          id: games[0].id,
        },
      },
      player: {
        create: {
          username: "Crno",
        },
      },
      sessionCharacters: {
        create: sessionCharacters,
      },
    },
  });

  return session;
};

const main = async () => {
  await createGameBoard().then(console.log).catch(console.error);
  await createGame().then(console.log).catch(console.error);
  await createCharacters().then(console.log).catch(console.error);
  // await createGameSession().then(console.log).catch(console.error);
  // await client.session.deleteMany({}).then(console.log);
  // await client.player.findMany().then(async (players) => {
  //   console.log("players", players);
  // });
  // const session = await client.gameSession.findUnique({
  //   where: { id: 1 },
  //   select: {
  //     id: true,
  //     sessionStart: true,
  //     sessionEnd: true,
  //     game: {
  //       select: {
  //         id: true,
  //         title: true,
  //         board: {
  //           select: {
  //             name: true,
  //             url: true,
  //             artist: true,
  //           },
  //         },
  //         targets: {
  //           select: {
  //             id: true,
  //             name: true,
  //             sprite: {
  //               select: {
  //                 name: true,
  //                 url: true,
  //               },
  //             },
  //           },
  //         },
  //       },
  //     },
  //     sessionCharacters: {
  //       select: {
  //         id: true,
  //         name: true,
  //         found: true,
  //         coordinates: true,
  //         sprite: {
  //           select: {
  //             name: true,
  //             url: true,
  //           },
  //         },
  //       },
  //     },
  //   },
  // });
  // console.log(session);
  // const game = await gameService.getGames({
  //   where: {
  //     id: 1,
  //   },
  //   select: {
  //     id: true,
  //     title: true,
  //     board: {
  //       select: {
  //         name: true,
  //         url: true,
  //         artist: true,
  //       },
  //     },
  //     targets: {
  //       select: {
  //         id: true,
  //         name: true,
  //         coordinates: true,
  //         sprite: {
  //           select: {
  //             url: true,
  //             artist: true,
  //           },
  //         },
  //       },
  //     },
  //   },
  // });
  // console.log(game[0].targets[0].coordinates);
};

main();
