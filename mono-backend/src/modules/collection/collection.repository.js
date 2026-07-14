const prisma = require("../../lib/prisma");

const getAllCollections = () => {
  return prisma.collection.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });
};

const getCollectionById = (id) => {
  return prisma.collection.findUnique({
    where: { id },
  });
};

const getCollectionByName = (name) => {
  return prisma.collection.findUnique({
    where: { name },
  });
};

const getCollectionBySlug = (slug) => {
  return prisma.collection.findUnique({
    where: { slug },
  });
};

const createCollection = (data) => {
  return prisma.collection.create({
    data,
  });
};

const updateCollection = (id, data) => {
  return prisma.collection.update({
    where: { id },
    data,
  });
};

const deleteCollection = (id) => {
  return prisma.collection.delete({
    where: { id },
  });
};

module.exports = {
  getAllCollections,
  getCollectionById,
  getCollectionByName,
  getCollectionBySlug,
  createCollection,
  updateCollection,
  deleteCollection,
};
