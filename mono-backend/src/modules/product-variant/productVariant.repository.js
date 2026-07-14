const prisma = require("../../lib/prisma");

const getAllVariants = () => {
  return prisma.productVariant.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });
};

const getVariantById = (id) => {
  return prisma.productVariant.findUnique({
    where: { id },
  });
};

const getVariantBySku = (sku) => {
  return prisma.productVariant.findUnique({
    where: { sku },
  });
};

const getVariantByBarcode = (barcode) => {
  return prisma.productVariant.findUnique({
    where: { barcode },
  });
};

const getVariantByCombination = (productId, colorId, sizeId) => {
  return prisma.productVariant.findUnique({
    where: {
      productId_colorId_sizeId: {
        productId,
        colorId,
        sizeId,
      },
    },
  });
};

const productExists = (id) => {
  return prisma.product.findUnique({
    where: { id },
    select: { id: true },
  });
};

const colorExists = (id) => {
  return prisma.color.findUnique({
    where: { id },
    select: { id: true },
  });
};

const sizeExists = (id) => {
  return prisma.size.findUnique({
    where: { id },
    select: { id: true },
  });
};

const imageExists = (id) => {
  return prisma.productImage.findUnique({
    where: { id },
    select: { id: true },
  });
};

const createVariant = (data) => {
  return prisma.productVariant.create({
    data,
  });
};

const updateVariant = (id, data) => {
  return prisma.productVariant.update({
    where: { id },
    data,
  });
};

const deleteVariant = (id) => {
  return prisma.productVariant.delete({
    where: { id },
  });
};

module.exports = {
  getAllVariants,
  getVariantById,
  getVariantBySku,
  getVariantByBarcode,
  getVariantByCombination,
  productExists,
  colorExists,
  sizeExists,
  imageExists,
  createVariant,
  updateVariant,
  deleteVariant,
};
