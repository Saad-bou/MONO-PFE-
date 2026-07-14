const createValidationError = (message) => {
  const error = new Error(message);
  error.statusCode = 400;
  return error;
};

const validateUpdateProfile = (req, res, next) => {
  try {
    const { firstName, lastName, avatar } = req.body;

    if (firstName !== undefined) {
      if (typeof firstName !== "string" || firstName.trim().length === 0) {
        throw createValidationError("firstName must be a non-empty string");
      }
    }

    if (lastName !== undefined) {
      if (typeof lastName !== "string" || lastName.trim().length === 0) {
        throw createValidationError("lastName must be a non-empty string");
      }
    }

    if (avatar !== undefined) {
      if (typeof avatar !== "string") {
        throw createValidationError("avatar must be a string");
      }
    }

    next();
  } catch (error) {
    next(error);
  }
};

const validateChangePassword = (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (typeof currentPassword !== "string" || currentPassword.trim().length === 0) {
      throw createValidationError("currentPassword is required");
    }

    if (typeof newPassword !== "string" || newPassword.trim().length < 8) {
      throw createValidationError("newPassword must be at least 8 characters long");
    }

    next();
  } catch (error) {
    next(error);
  }
};

module.exports = {
  validateUpdateProfile,
  validateChangePassword,
};
