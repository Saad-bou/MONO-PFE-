const orderRepository = require("./order.repository");

const createError = (statusCode, message) => {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
};

const ALLOWED_STATUSES = new Set([
  "PENDING",
  "PROCESSING",
  "SHIPPED",
  "DELIVERED",
  "CANCELLED",
]);

const toNumber = (value) => Number(value);

const resolveUnitPrice = (variant) => {
  if (variant.price !== null && variant.price !== undefined) {
    return toNumber(variant.price);
  }

  return toNumber(variant.product.price);
};

const buildOrderNumber = async (tx) => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  const prefix = `MONO-${year}${month}${day}-`;

  const count = await orderRepository.countOrdersByPrefix(prefix, tx);
  const sequence = String(count + 1).padStart(6, "0");

  return `${prefix}${sequence}`;
};

const checkout = async (userId, { shippingAddress, paymentMethod }) => {
  const cart = await orderRepository.findCartByUserId(userId);

  if (!cart || !cart.items || cart.items.length === 0) {
    throw createError(400, "Cart is empty");
  }

  for (const item of cart.items) {
    if (!item.variant) {
      throw createError(404, "Product variant not found");
    }

    if (item.quantity > item.variant.stock) {
      throw createError(409, "Insufficient stock");
    }
  }

  const order = await orderRepository.runCheckoutTransaction(async (tx) => {
    const freshCart = await orderRepository.findCartByUserId(userId, tx);

    if (!freshCart || !freshCart.items || freshCart.items.length === 0) {
      throw createError(400, "Cart is empty");
    }

    let totalAmount = 0;
    const orderItemsData = [];

    for (const item of freshCart.items) {
      if (!item.variant) {
        throw createError(404, "Product variant not found");
      }

      if (item.quantity > item.variant.stock) {
        throw createError(409, "Insufficient stock");
      }

      const unitPrice = resolveUnitPrice(item.variant);
      totalAmount += unitPrice * item.quantity;

      orderItemsData.push({
        variantId: item.variantId,
        quantity: item.quantity,
        price: unitPrice,
      });

      const stockUpdate = await orderRepository.updateVariantStock(
        item.variantId,
        item.quantity,
        tx,
      );

      if (stockUpdate.count === 0) {
        throw createError(409, "Insufficient stock");
      }
    }

    const orderNumber = await buildOrderNumber(tx);

    const createdOrder = await orderRepository.createOrder(
      {
        orderNumber,
        totalAmount,
        shippingAddress,
        paymentMethod,
        paymentStatus: "UNPAID",
        status: "PENDING",
        userId,
      },
      tx,
    );

    await orderRepository.createOrderItems(
      orderItemsData.map((item) => ({
        ...item,
        orderId: createdOrder.id,
      })),
      tx,
    );

    await orderRepository.clearCart(freshCart.id, tx);

    return createdOrder;
  });

  return orderRepository.findOrderById(order.id);
};

const getMyOrders = async (userId) => {
  return orderRepository.findOrdersByUser(userId);
};

const getOrderById = async (orderId, user) => {
  const order = await orderRepository.findOrderById(orderId);

  if (!order) {
    throw createError(404, "Order not found");
  }

  const roleName = user.role && user.role.name;
  const isOwner = order.userId === user.id;
  const isAdmin = roleName === "ADMIN";

  if (!isOwner && !isAdmin) {
    throw createError(403, "Forbidden");
  }

  return order;
};

const getAllOrders = async () => {
  return orderRepository.findAllOrders();
};

const updateStatus = async (orderId, status) => {
  if (!ALLOWED_STATUSES.has(status)) {
    throw createError(400, "Invalid order status");
  }

  const order = await orderRepository.findOrderById(orderId);

  if (!order) {
    throw createError(404, "Order not found");
  }

  return orderRepository.updateOrderStatus(orderId, status);
};

module.exports = {
  checkout,
  getMyOrders,
  getOrderById,
  getAllOrders,
  updateStatus,
  ALLOWED_STATUSES,
};
