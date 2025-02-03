const gameOptions = {
  select: {
    id: true,
    title: true,
    board: {
      select: {
        url: true,
        artist: true,
      },
    },
    targets: {
      select: {
        id: true,
        name: true,
        sprite: {
          select: {
            url: true,
            artist: true,
          },
        },
      },
    },
  },
};

export default gameOptions;
