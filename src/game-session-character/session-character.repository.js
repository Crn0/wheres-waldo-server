import query from "../db/query.js";

const findMany = query.findMany("sessionCharacter");

const findUnique = query.findUnique("sessionCharacter");

const updateOne = query.updateOne("sessionCharacter");

const updateSessionCharacter = async (queryDTO) => updateOne(queryDTO);

const getSessionCharacter = async (queryDTO) => findUnique(queryDTO);

const getSessionCharacters = async (queryDTO) => findMany(queryDTO);

export default {
  updateSessionCharacter,
  getSessionCharacter,
  getSessionCharacters,
};
