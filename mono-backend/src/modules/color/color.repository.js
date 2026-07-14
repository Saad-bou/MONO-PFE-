const prisma = require("../../lib/prisma");

const getAllColors = () => {
  return prisma.color.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });
};

const getColorById = (id) => {
  return prisma.color.findUnique({
    where: { id },
  });
};

const getColorByName = (name) => {
  return prisma.color.findUnique({
    where: { name },
  });
};

const getColorByHexCode = (hexCode) => {
  return prisma.color.findFirst({
    where: { hexCode },
  });
};

const createColor = (data) => {
  return prisma.color.create({
    data,
  });
};

const updateColor = (id, data) => {
  return prisma.color.update({
    where: { id },
    data,
  });
};

const deleteColor = (id) => {
  return prisma.color.delete({
    where: { id },
  });
};

module.exports = {
  getAllColors,
  getColorById,
  getColorByName,
  getColorByHexCode,
  createColor,
  updateColor,
  deleteColor,
};
