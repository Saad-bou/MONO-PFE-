const createValidationError = (message) => {
  const error = new Error(message);
  error.statusCode = 400;
  return error;
};

const validateAddWishlistItem = (req, res, next) => {
  try {
    const { productId } = req.body;

    if (typeof productId !== "string" || productId.trim().length === 0) {
      throw createValidationError("productId is required");
    }

    req.body.productId = productId.trim();

    next();
  } catch (error) {
    next(error);
  }
};

module.exports = {
  validateAddWishlistItem,
};
