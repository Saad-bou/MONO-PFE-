const createValidationError = (message) => {
  const error = new Error(message);
  error.statusCode = 400;
  return error;
};

const validateAddCartItem = (req, res, next) => {
  try {
    const { variantId, quantity } = req.body;

    if (typeof variantId !== "string" || variantId.trim().length === 0) {
      throw createValidationError("variantId is required");
    }

    if (typeof quantity !== "number" || !Number.isInteger(quantity) || quantity < 1) {
      throw createValidationError("quantity must be an integer greater than or equal to 1");
    }

    req.body.variantId = variantId.trim();

    next();
  } catch (error) {
    next(error);
  }
};

const validateUpdateCartItem = (req, res, next) => {
  try {
    const { quantity } = req.body;

    if (typeof quantity !== "number" || !Number.isInteger(quantity) || quantity < 1) {
      throw createValidationError("quantity must be an integer greater than or equal to 1");
    }

    next();
  } catch (error) {
    next(error);
  }
};

module.exports = {
  validateAddCartItem,
  validateUpdateCartItem,
};
