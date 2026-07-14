const cartRepository = require("./cart.repository");

const createError = (statusCode, message) => {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
};

const toNumber = (value) => {
  return Number(value);
};

const resolveUnitPrice = (variant) => {
  if (variant.price !== null && variant.price !== undefined) {
    return toNumber(variant.price);
  }

  return toNumber(variant.product.price);
};

const decorateCart = (cart) => {
  let subtotal = 0;
  let totalItems = 0;

  const items = cart.items.map((item) => {
    const unitPrice = resolveUnitPrice(item.variant);
    const lineTotal = unitPrice * item.quantity;

    subtotal += lineTotal;
    totalItems += item.quantity;

    return {
      ...item,
      unitPrice,
      quantity: item.quantity,
      lineTotal,
    };
  });

  return {
    ...cart,
    items,
    subtotal,
    totalItems,
  };
};

const getOrCreateCart = async (userId) => {
  let cart = await cartRepository.findCartByUserId(userId);

  if (!cart) {
    cart = await cartRepository.createCart(userId);
  }

  return cart;
};

const ensureVariantExists = async (variantId) => {
  const variant = await cartRepository.findVariant(variantId);

  if (!variant) {
    throw createError(404, "Product variant not found");
  }

  return variant;
};

const ensureSufficientStock = (variant, quantity) => {
  if (quantity > variant.stock) {
    throw createError(409, "Insufficient stock");
  }
};

const getMyCart = async (userId) => {
  await getOrCreateCart(userId);

  const cart = await cartRepository.getCart(userId);

  return decorateCart(cart);
};

const addItem = async (userId, { variantId, quantity }) => {
  const variant = await ensureVariantExists(variantId);
  const cart = await getOrCreateCart(userId);
  const existingItem = await cartRepository.findCartItem(cart.id, variantId);

  const nextQuantity = existingItem ? existingItem.quantity + quantity : quantity;

  ensureSufficientStock(variant, nextQuantity);

  if (existingItem) {
    await cartRepository.updateCartItem(cart.id, variantId, nextQuantity);
  } else {
    await cartRepository.createCartItem(cart.id, variantId, quantity);
  }

  return getMyCart(userId);
};

const updateItem = async (userId, variantId, quantity) => {
  const variant = await ensureVariantExists(variantId);
  const cart = await getOrCreateCart(userId);
  const existingItem = await cartRepository.findCartItem(cart.id, variantId);

  if (!existingItem) {
    throw createError(404, "Cart item not found");
  }

  ensureSufficientStock(variant, quantity);

  await cartRepository.updateCartItem(cart.id, variantId, quantity);

  return getMyCart(userId);
};

const removeItem = async (userId, variantId) => {
  const cart = await getOrCreateCart(userId);
  const existingItem = await cartRepository.findCartItem(cart.id, variantId);

  if (!existingItem) {
    throw createError(404, "Cart item not found");
  }

  await cartRepository.deleteCartItem(cart.id, variantId);

  return { variantId };
};

const clear = async (userId) => {
  const cart = await getOrCreateCart(userId);

  await cartRepository.clearCart(cart.id);

  return { cartId: cart.id };
};

module.exports = {
  getMyCart,
  addItem,
  updateItem,
  removeItem,
  clear,
};
