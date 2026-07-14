const createValidationError = (message) => {
  const error = new Error(message);
  error.statusCode = 400;
  return error;
};

const validateCollectionPayload = (req, res, next) => {
  try {
    const { name, isFeatured } = req.body;

    if (typeof name !== "string" || name.trim().length === 0) {
      throw createValidationError("name is required");
    }

    if (name.trim().length < 2) {
      throw createValidationError("name must be at least 2 characters");
    }

    if (isFeatured !== undefined && typeof isFeatured !== "boolean") {
      throw createValidationError("isFeatured must be a boolean");
    }

    next();
  } catch (error) {
    next(error);
  }
};

module.exports = {
  validateCollectionPayload,
};
