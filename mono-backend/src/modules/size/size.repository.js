const prisma = require("../../lib/prisma");

const getAllSizes = () => {
  return prisma.size.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });
};

const getSizeById = (id) => {
  return prisma.size.findUnique({
    where: { id },
  });
};

const getSizeByName = (name) => {
  return prisma.size.findUnique({
    where: { name },
  });
};

const createSize = (data) => {
  return prisma.size.create({
    data,
  });
};

const updateSize = (id, data) => {
  return prisma.size.update({
    where: { id },
    data,
  });
};

const deleteSize = (id) => {
  return prisma.size.delete({
    where: { id },
  });
};

module.exports = {
  getAllSizes,
  getSizeById,
  getSizeByName,
  createSize,
  updateSize,
  deleteSize,
};
