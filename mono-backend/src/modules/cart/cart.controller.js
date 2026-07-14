const cartService = require("./cart.service");

const getMyCart = async (req, res, next) => {
  try {
    const cart = await cartService.getMyCart(req.user.id);

    res.status(200).json({
      success: true,
      message: "Cart retrieved successfully",
      data: cart,
    });
  } catch (error) {
    next(error);
  }
};

const addItem = async (req, res, next) => {
  try {
    const cart = await cartService.addItem(req.user.id, req.body);

    res.status(201).json({
      success: true,
      message: "Item added to cart successfully",
      data: cart,
    });
  } catch (error) {
    next(error);
  }
};

const updateItem = async (req, res, next) => {
  try {
    const cart = await cartService.updateItem(
      req.user.id,
      req.params.variantId,
      req.body.quantity,
    );

    res.status(200).json({
      success: true,
      message: "Cart item updated successfully",
      data: cart,
    });
  } catch (error) {
    next(error);
  }
};

const removeItem = async (req, res, next) => {
  try {
    const result = await cartService.removeItem(req.user.id, req.params.variantId);

    res.status(200).json({
      success: true,
      message: "Cart item removed successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const clear = async (req, res, next) => {
  try {
    const result = await cartService.clear(req.user.id);

    res.status(200).json({
      success: true,
      message: "Cart cleared successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getMyCart,
  addItem,
  updateItem,
  removeItem,
  clear,
};
