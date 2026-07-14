const prisma = require("../../lib/prisma");

const getAllImages = () => {
  return prisma.productImage.findMany({
    orderBy: [
      { productId: "asc" },
      { displayOrder: "asc" },
      { createdAt: "desc" },
    ],
  });
};

const getImageById = (id) => {
  return prisma.productImage.findUnique({
    where: { id },
  });
};

const getImagesByProductId = (productId) => {
  return prisma.productImage.findMany({
    where: { productId },
    orderBy: [
      { displayOrder: "asc" },
      { createdAt: "desc" },
    ],
  });
};

const productExists = (id) => {
  return prisma.product.findUnique({
    where: { id },
    select: { id: true },
  });
};

const clearMainImage = (productId) => {
  return prisma.productImage.updateMany({
    where: {
      productId,
      isMain: true,
    },
    data: {
      isMain: false,
    },
  });
};

const createImage = (data) => {
  return prisma.productImage.create({
    data,
  });
};

const updateImage = (id, data) => {
  return prisma.productImage.update({
    where: { id },
    data,
  });
};

const deleteImage = (id) => {
  return prisma.productImage.delete({
    where: { id },
  });
};

module.exports = {
  getAllImages,
  getImageById,
  getImagesByProductId,
  productExists,
  clearMainImage,
  createImage,
  updateImage,
  deleteImage,
};
