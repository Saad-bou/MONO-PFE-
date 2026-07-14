const createValidationError = (message) => {
  const error = new Error(message);
  error.statusCode = 400;
  return error;
};

const validateCreate = (req, res, next) => {
  try {
    const { productId, userImage } = req.body;

    if (typeof productId !== "string" || productId.trim().length === 0) {
      throw createValidationError("productId is required");
    }

    if (typeof userImage !== "string" || userImage.trim().length === 0) {
      throw createValidationError("userImage is required");
    }

    next();
  } catch (error) {
    next(error);
  }
};

module.exports = {
  validateCreate,
};
