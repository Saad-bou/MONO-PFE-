const HEX_COLOR_REGEX = /^#[0-9A-Fa-f]{6}$/;

const createValidationError = (message) => {
  const error = new Error(message);
  error.statusCode = 400;
  return error;
};

const validateColorPayload = (req, res, next) => {
  try {
    const { name, hexCode } = req.body;

    if (typeof name !== "string" || name.trim().length === 0) {
      throw createValidationError("name is required");
    }

    if (name.trim().length < 2) {
      throw createValidationError("name must be at least 2 characters");
    }

    if (typeof hexCode !== "string" || hexCode.trim().length === 0) {
      throw createValidationError("hexCode is required");
    }

    if (!HEX_COLOR_REGEX.test(hexCode.trim())) {
      throw createValidationError("hexCode must be a valid HEX color");
    }

    next();
  } catch (error) {
    next(error);
  }
};

module.exports = {
  validateColorPayload,
};
