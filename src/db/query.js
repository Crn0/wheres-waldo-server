import { client } from "./client.cjs";

const createOne = (table) => async (dataDTO, selectDTO) =>
  client[table].create({ data: dataDTO.data, select: { ...selectDTO.select } });

const updateOne = (table) => async (queryDTO) =>
  client[table].update({
    where: {
      ...queryDTO.where,
    },
    data: {
      ...queryDTO.data,
    },
    select: {
      ...queryDTO.select,
    },
  });

const deleteOne = (table) => async (queryDTO) => client[table].delete(queryDTO);

const findMany = (table) => async (queryDTO) =>
  client[table].findMany({
    where: {
      ...queryDTO.where,
    },
    select: {
      ...queryDTO.select,
    },
  });

const findUnique = (table) => async (queryDTO) =>
  client[table].findUnique({
    where: {
      ...queryDTO.where,
    },
    select: {
      ...queryDTO.select,
    },
  });

const queryRaw = async (query) => client.$queryRaw`${query}`;

export default {
  createOne,
  updateOne,
  deleteOne,
  queryRaw,
  findMany,
  findUnique,
};
