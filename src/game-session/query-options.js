const gameSessionOptions = {
  select: {
    id: true,
    sessionStart: true,
    sessionEnd: true,
    game: {
      select: {
        id: true,
        title: true,
        board: {
          select: {
            name: true,
            url: true,
            artist: true,
          },
        },
      },
    },
    sessionCharacters: {
      select: {
        id: true,
        name: true,
        found: true,
        coordinates: {
          select: {
            normalizedX: true,
            normalizedY: true,
            rightX: true,
            rightY: true,
            leftX: true,
            leftY: true,
          },
        },
        sprite: {
          select: {
            name: true,
            url: true,
          },
        },
      },
    },
  },
};

export default gameSessionOptions;
