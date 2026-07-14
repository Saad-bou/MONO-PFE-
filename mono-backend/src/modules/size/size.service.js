const sizeRepository = require("./size.repository");

const createError = (statusCode, message) => {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
};

const normalizeSizeInput = (data) => {
  return {
    name: data.name.trim(),
  };
};

const getAll = async () => {
  return sizeRepository.getAllSizes();
};

const getOne = async (id) => {
  const size = await sizeRepository.getSizeById(id);

  if (!size) {
    throw createError(404, "Size not found");
  }

  return size;
};

const create = async (data) => {
  const cleanData = normalizeSizeInput(data);
  const existingByName = await sizeRepository.getSizeByName(cleanData.name);

  if (existingByName) {
    throw createError(409, "Size name already exists");
  }

  return sizeRepository.createSize(cleanData);
};

const update = async (id, data) => {
  const size = await sizeRepository.getSizeById(id);

  if (!size) {
    throw createError(404, "Size not found");
  }

  const cleanData = normalizeSizeInput(data);
  const existingByName = await sizeRepository.getSizeByName(cleanData.name);

  if (existingByName && existingByName.id !== id) {
    throw createError(409, "Size name already exists");
  }

  return sizeRepository.updateSize(id, cleanData);
};

const remove = async (id) => {
  const size = await sizeRepository.getSizeById(id);

  if (!size) {
    throw createError(404, "Size not found");
  }

  await sizeRepository.deleteSize(id);

  return { id };
};

module.exports = {
  getAll,
  getOne,
  create,
  update,
  remove,
};
