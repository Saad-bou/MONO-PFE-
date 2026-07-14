const createValidationError = (message) => {
  const error = new Error(message);
  error.statusCode = 400;
  return error;
};

const validateProductImagePayload = (req, res, next) => {
  try {
    const { url, productId, altText, isMain, displayOrder } = req.body;

    if (typeof url !== "string" || url.trim().length === 0) {
      throw createValidationError("url is required");
    }

    if (typeof productId !== "string" || productId.trim().length === 0) {
      throw createValidationError("productId is required");
    }

    if (altText !== undefined && (typeof altText !== "string" || altText.trim().length === 0)) {
      throw createValidationError("altText must be a non-empty string");
    }

    if (isMain !== undefined && typeof isMain !== "boolean") {
      throw createValidationError("isMain must be a boolean");
    }

    if (
      displayOrder !== undefined &&
      (typeof displayOrder !== "number" || !Number.isInteger(displayOrder) || displayOrder < 0)
    ) {
      throw createValidationError("displayOrder must be an integer greater than or equal to zero");
    }

    next();
  } catch (error) {
    next(error);
  }
};

module.exports = {
  validateProductImagePayload,
};
