const wishlistRepository = require("./wishlist.repository");

const createError = (statusCode, message) => {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
};

const getOrCreateWishlist = async (userId) => {
  let wishlist = await wishlistRepository.findWishlistByUserId(userId);

  if (!wishlist) {
    wishlist = await wishlistRepository.createWishlist(userId);
  }

  return wishlist;
};

const getMyWishlist = async (userId) => {
  await getOrCreateWishlist(userId);

  const wishlist = await wishlistRepository.getWishlist(userId);

  return wishlist;
};

const addItem = async (userId, productId) => {
  const product = await wishlistRepository.productExists(productId);

  if (!product) {
    throw createError(404, "Product not found");
  }

  const wishlist = await getOrCreateWishlist(userId);
  const existingItem = await wishlistRepository.findWishlistItem(
    wishlist.id,
    productId,
  );

  if (existingItem) {
    throw createError(409, "Product already exists in wishlist");
  }

  return wishlistRepository.createWishlistItem(wishlist.id, productId);
};

const removeItem = async (userId, productId) => {
  const wishlist = await getOrCreateWishlist(userId);
  const existingItem = await wishlistRepository.findWishlistItem(
    wishlist.id,
    productId,
  );

  if (!existingItem) {
    throw createError(404, "Wishlist item not found");
  }

  await wishlistRepository.deleteWishlistItem(wishlist.id, productId);

  return { productId };
};

const clear = async (userId) => {
  const wishlist = await getOrCreateWishlist(userId);

  await wishlistRepository.clearWishlist(wishlist.id);

  return { wishlistId: wishlist.id };
};

module.exports = {
  getMyWishlist,
  addItem,
  removeItem,
  clear,
};
