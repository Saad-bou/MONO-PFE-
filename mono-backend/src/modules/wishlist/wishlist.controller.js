const wishlistService = require("./wishlist.service");

const getMyWishlist = async (req, res, next) => {
  try {
    const wishlist = await wishlistService.getMyWishlist(req.user.id);

    res.status(200).json({
      success: true,
      message: "Wishlist retrieved successfully",
      data: wishlist,
    });
  } catch (error) {
    next(error);
  }
};

const addItem = async (req, res, next) => {
  try {
    const item = await wishlistService.addItem(req.user.id, req.body.productId);

    res.status(201).json({
      success: true,
      message: "Product added to wishlist successfully",
      data: item,
    });
  } catch (error) {
    next(error);
  }
};

const removeItem = async (req, res, next) => {
  try {
    const result = await wishlistService.removeItem(
      req.user.id,
      req.params.productId,
    );

    res.status(200).json({
      success: true,
      message: "Product removed from wishlist successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const clear = async (req, res, next) => {
  try {
    const result = await wishlistService.clear(req.user.id);

    res.status(200).json({
      success: true,
      message: "Wishlist cleared successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getMyWishlist,
  addItem,
  removeItem,
  clear,
};
