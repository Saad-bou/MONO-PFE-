const createValidationError = (message) => {
  const error = new Error(message);
  error.statusCode = 400;
  return error;
};

const validateCategoryPayload = (req, res, next) => {
  try {
    const { name } = req.body;

    if (typeof name !== "string" || name.trim().length === 0) {
      throw createValidationError("name is required");
    }

    if (name.trim().length < 2) {
      throw createValidationError("name must be at least 2 characters");
    }

    next();
  } catch (error) {
    next(error);
  }
};

module.exports = {
  validateCategoryPayload,
};
