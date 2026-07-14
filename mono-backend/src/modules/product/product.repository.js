const prisma = require("../../lib/prisma");

const catalogInclude = {
  category: true,
  collections: {
    include: {
      collection: true,
    },
  },
  images: {
    orderBy: {
      displayOrder: "asc",
    },
  },
  variants: {
    include: {
      color: true,
      size: true,
    },
  },
};

const getAllProducts = () => {
  return prisma.product.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });
};

const getProductById = (id) => {
  return prisma.product.findUnique({
    where: { id },
  });
};

const getProductBySku = (sku) => {
  return prisma.product.findUnique({
    where: { sku },
  });
};

const getProductBySlug = (slug) => {
  return prisma.product.findUnique({
    where: { slug },
  });
};

const getCatalogProductBySlug = (slug) => {
  return prisma.product.findUnique({
    where: { slug },
    include: catalogInclude,
  });
};

const buildCatalogWhere = ({
  category,
  collection,
  featured,
  minPrice,
  maxPrice,
  search,
}) => {
  const where = {};

  if (category) {
    where.category = {
      slug: category,
    };
  }

  if (collection) {
    where.collections = {
      some: {
        collection: {
          slug: collection,
        },
      },
    };
  }

  if (featured === true) {
    where.isFeatured = true;
  }

  if (minPrice !== undefined || maxPrice !== undefined) {
    where.price = {};

    if (minPrice !== undefined) {
      where.price.gte = minPrice;
    }

    if (maxPrice !== undefined) {
      where.price.lte = maxPrice;
    }
  }

  if (search) {
    where.OR = [
      { name: { contains: search } },
      { description: { contains: search } },
      { brand: { contains: search } },
    ];
  }

  return where;
};

const getCatalogProducts = async ({ where, orderBy, skip, take }) => {
  const [data, total] = await Promise.all([
    prisma.product.findMany({
      where,
      include: catalogInclude,
      orderBy,
      skip,
      take,
    }),
    prisma.product.count({ where }),
  ]);

  return { data, total };
};

const categoryExists = (categoryId) => {
  return prisma.category.findUnique({
    where: { id: categoryId },
    select: { id: true },
  });
};

const createProduct = (data) => {
  return prisma.product.create({
    data,
  });
};

const updateProduct = (id, data) => {
  return prisma.product.update({
    where: { id },
    data,
  });
};

const deleteProduct = (id) => {
  return prisma.product.delete({
    where: { id },
  });
};

module.exports = {
  getAllProducts,
  getProductById,
  getProductBySku,
  getProductBySlug,
  getCatalogProductBySlug,
  buildCatalogWhere,
  getCatalogProducts,
  categoryExists,
  createProduct,
  updateProduct,
  deleteProduct,
};
