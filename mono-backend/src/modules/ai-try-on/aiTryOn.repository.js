const prisma = require("../../lib/prisma");

const create = async (data) => {
  return await prisma.aITryOnHistory.create({
    data,
  });
};

const update = async (id, data) => {
  return await prisma.aITryOnHistory.update({
    where: { id },
    data,
  });
};

const findByUser = async (userId) => {
  return await prisma.aITryOnHistory.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    include: {
      product: {
        include: {
          category: true,
        },
      },
    },
  });
};

const findById = async (id) => {
  return await prisma.aITryOnHistory.findUnique({
    where: { id },
  });
};

const remove = async (id) => {
  return await prisma.aITryOnHistory.delete({
    where: { id },
  });
};

// Check if product exists
const findProductById = async (productId) => {
  return await prisma.product.findUnique({
    where: { id: productId },
    include: {
      images: {
        orderBy: { displayOrder: "asc" },
      },
    },
  });
};

module.exports = {
  create,
  update,
  findByUser,
  findById,
  remove,
  findProductById,
};
