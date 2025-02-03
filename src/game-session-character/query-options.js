const sessionCharacterOptions = {
  select: {
    id: true,
    name: true,
    sprite: {
      select: {
        url: true,
        artist: true,
      },
    },
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
  },
};

export default sessionCharacterOptions;
