const prisma = require("../../lib/prisma");

const cartItemInclude = {
  variant: {
    include: {
      color: true,
      size: true,
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

const cartInclude = {
  items: {
    orderBy: {
      createdAt: "desc",
    },
    include: cartItemInclude,
  },
};

const findCartByUserId = (userId) => {
  return prisma.cart.findUnique({
    where: { userId },
  });
};

const createCart = (userId) => {
  return prisma.cart.create({
    data: { userId },
  });
};

const getCart = (userId) => {
  return prisma.cart.findUnique({
    where: { userId },
    include: cartInclude,
  });
};

const findVariant = (variantId) => {
  return prisma.productVariant.findUnique({
    where: { id: variantId },
    include: {
      product: {
        select: {
          id: true,
          price: true,
        },
      },
    },
  });
};

const findCartItem = (cartId, variantId) => {
  return prisma.cartItem.findUnique({
    where: {
      cartId_variantId: {
        cartId,
        variantId,
      },
    },
  });
};

const createCartItem = (cartId, variantId, quantity) => {
  return prisma.cartItem.create({
    data: {
      cartId,
      variantId,
      quantity,
    },
    include: cartItemInclude,
  });
};

const updateCartItem = (cartId, variantId, quantity) => {
  return prisma.cartItem.update({
    where: {
      cartId_variantId: {
        cartId,
        variantId,
      },
    },
    data: {
      quantity,
    },
    include: cartItemInclude,
  });
};

const deleteCartItem = (cartId, variantId) => {
  return prisma.cartItem.delete({
    where: {
      cartId_variantId: {
        cartId,
        variantId,
      },
    },
  });
};

const clearCart = (cartId) => {
  return prisma.cartItem.deleteMany({
    where: { cartId },
  });
};

module.exports = {
  findCartByUserId,
  createCart,
  getCart,
  findVariant,
  findCartItem,
  createCartItem,
  updateCartItem,
  deleteCartItem,
  clearCart,
};
