const prisma = require("../../lib/prisma");

const orderItemInclude = {
  variant: {
    include: {
      color: true,
      size: true,
      product: true,
    },
  },
};

const userOrderInclude = {
  items: {
    include: orderItemInclude,
  },
};

const adminOrderInclude = {
  user: {
    select: {
      id: true,
      firstName: true,
      lastName: true,
      email: true,
    },
  },
  items: {
    include: {
      variant: {
        include: {
          product: true,
        },
      },
    },
  },
};

const findCartByUserId = (userId, tx = prisma) => {
  return tx.cart.findUnique({
    where: { userId },
    include: {
      items: {
        include: {
          variant: {
            include: {
              product: {
                select: {
                  id: true,
                  price: true,
                },
              },
            },
          },
        },
      },
    },
  });
};

const countOrdersByPrefix = (prefix, tx = prisma) => {
  return tx.order.count({
    where: {
      orderNumber: {
        startsWith: prefix,
      },
    },
  });
};

const createOrder = (data, tx = prisma) => {
  return tx.order.create({
    data,
  });
};

const createOrderItems = (items, tx = prisma) => {
  return tx.orderItem.createMany({
    data: items,
  });
};

const updateVariantStock = (variantId, quantity, tx = prisma) => {
  return tx.productVariant.updateMany({
    where: {
      id: variantId,
      stock: {
        gte: quantity,
      },
    },
    data: {
      stock: {
        decrement: quantity,
      },
    },
  });
};

const clearCart = (cartId, tx = prisma) => {
  return tx.cartItem.deleteMany({
    where: { cartId },
  });
};

const findOrdersByUser = (userId) => {
  return prisma.order.findMany({
    where: { userId },
    include: userOrderInclude,
    orderBy: {
      createdAt: "desc",
    },
  });
};

const findOrderById = (id) => {
  return prisma.order.findUnique({
    where: { id },
    include: userOrderInclude,
  });
};

const findAllOrders = () => {
  return prisma.order.findMany({
    include: adminOrderInclude,
    orderBy: {
      createdAt: "desc",
    },
  });
};

const updateOrderStatus = (id, status) => {
  return prisma.order.update({
    where: { id },
    data: { status },
    include: adminOrderInclude,
  });
};

const runCheckoutTransaction = (callback) => {
  return prisma.$transaction(callback);
};

module.exports = {
  findCartByUserId,
  countOrdersByPrefix,
  createOrder,
  createOrderItems,
  updateVariantStock,
  clearCart,
  findOrdersByUser,
  findOrderById,
  findAllOrders,
  updateOrderStatus,
  runCheckoutTransaction,
};
