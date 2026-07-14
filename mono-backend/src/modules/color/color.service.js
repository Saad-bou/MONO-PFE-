const colorRepository = require("./color.repository");

const createError = (statusCode, message) => {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
};

const normalizeColorInput = (data) => {
  return {
    name: data.name.trim(),
    hexCode: data.hexCode.trim().toUpperCase(),
  };
};

const getAll = async () => {
  return colorRepository.getAllColors();
};

const getOne = async (id) => {
  const color = await colorRepository.getColorById(id);

  if (!color) {
    throw createError(404, "Color not found");
  }

  return color;
};

const create = async (data) => {
  const cleanData = normalizeColorInput(data);
  const existingByName = await colorRepository.getColorByName(cleanData.name);

  if (existingByName) {
    throw createError(409, "Color name already exists");
  }

  const existingByHexCode = await colorRepository.getColorByHexCode(cleanData.hexCode);

  if (existingByHexCode) {
    throw createError(409, "Color hexCode already exists");
  }

  return colorRepository.createColor(cleanData);
};

const update = async (id, data) => {
  const color = await colorRepository.getColorById(id);

  if (!color) {
    throw createError(404, "Color not found");
  }

  const cleanData = normalizeColorInput(data);
  const existingByName = await colorRepository.getColorByName(cleanData.name);

  if (existingByName && existingByName.id !== id) {
    throw createError(409, "Color name already exists");
  }

  const existingByHexCode = await colorRepository.getColorByHexCode(cleanData.hexCode);

  if (existingByHexCode && existingByHexCode.id !== id) {
    throw createError(409, "Color hexCode already exists");
  }

  return colorRepository.updateColor(id, cleanData);
};

const remove = async (id) => {
  const color = await colorRepository.getColorById(id);

  if (!color) {
    throw createError(404, "Color not found");
  }

  await colorRepository.deleteColor(id);

  return { id };
};

module.exports = {
  getAll,
  getOne,
  create,
  update,
  remove,
};
