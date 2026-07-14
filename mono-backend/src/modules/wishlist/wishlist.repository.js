const prisma = require("../../lib/prisma");

const wishlistInclude = {
  items: {
    orderBy: {
      createdAt: "desc",
    },
    include: {
      product: {
        include: {
          category: true,
          images: {
            where: {
              isMain: true,
            },
            take: 1,
            orderBy: {
              displayOrder: "asc",
            },
          },
        },
      },
    },
  },
};

const findWishlistByUserId = (userId) => {
  return prisma.wishlist.findUnique({
    where: { userId },
  });
};

const createWishlist = (userId) => {
  return prisma.wishlist.create({
    data: { userId },
  });
};

const getWishlist = (userId) => {
  return prisma.wishlist.findUnique({
    where: { userId },
    include: wishlistInclude,
  });
};

const findWishlistItem = (wishlistId, productId) => {
  return prisma.wishlistItem.findUnique({
    where: {
      wishlistId_productId: {
        wishlistId,
        productId,
      },
    },
  });
};

const createWishlistItem = (wishlistId, productId) => {
  return prisma.wishlistItem.create({
    data: {
      wishlistId,
      productId,
    },
    include: {
      product: {
        include: {
          category: true,
          images: {
            where: {
              isMain: true,
            },
            take: 1,
            orderBy: {
              displayOrder: "asc",
            },
          },
        },
      },
    },
  });
};

const deleteWishlistItem = (wishlistId, productId) => {
  return prisma.wishlistItem.delete({
    where: {
      wishlistId_productId: {
        wishlistId,
        productId,
      },
    },
  });
};

const clearWishlist = (wishlistId) => {
  return prisma.wishlistItem.deleteMany({
    where: { wishlistId },
  });
};

const productExists = (productId) => {
  return prisma.product.findUnique({
    where: { id: productId },
    select: { id: true },
  });
};

module.exports = {
  findWishlistByUserId,
  createWishlist,
  getWishlist,
  findWishlistItem,
  createWishlistItem,
  deleteWishlistItem,
  clearWishlist,
  productExists,
};
