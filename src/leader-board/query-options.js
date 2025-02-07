const leaderBoardOptions = {
  select: {
    id: true,
    game: {
      select: {
        id: true,
        title: true,
        board: {
          select: {
            url: true,
            artist: true,
          },
        },
      },
    },
  },
};

export default leaderBoardOptions;
