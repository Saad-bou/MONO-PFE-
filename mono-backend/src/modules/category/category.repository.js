const prisma = require("../../lib/prisma");

const getAllCategories = () => {
  return prisma.category.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });
};

const getCategoryById = (id) => {
  return prisma.category.findUnique({
    where: { id },
  });
};

const getCategoryByName = (name) => {
  return prisma.category.findUnique({
    where: { name },
  });
};

const getCategoryBySlug = (slug) => {
  return prisma.category.findUnique({
    where: { slug },
  });
};

const countProductsByCategoryId = (categoryId) => {
  return prisma.product.count({
    where: { categoryId },
  });
};

const createCategory = (data) => {
  return prisma.category.create({
    data,
  });
};

const updateCategory = (id, data) => {
  return prisma.category.update({
    where: { id },
    data,
  });
};

const deleteCategory = (id) => {
  return prisma.category.delete({
    where: { id },
  });
};

module.exports = {
  getAllCategories,
  getCategoryById,
  getCategoryByName,
  getCategoryBySlug,
  countProductsByCategoryId,
  createCategory,
  updateCategory,
  deleteCategory,
};
