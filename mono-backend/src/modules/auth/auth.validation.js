const createValidationError = (message) => {
  const error = new Error(message);
  error.statusCode = 400;
  return error;
};

const validateRequiredString = (value, fieldName) => {
  if (typeof value !== "string" || value.trim().length === 0) {
    throw createValidationError(`${fieldName} is required`);
  }
};

const validateMinLength = (value, fieldName, minLength) => {
  if (value.trim().length < minLength) {
    throw createValidationError(`${fieldName} must be at least ${minLength} characters`);
  }
};

const validateEmail = (email) => {
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailPattern.test(email.trim())) {
    throw createValidationError("email must be a valid email address");
  }
};

const validateRegister = (req, _res, next) => {
  try {
    const { firstName, lastName, email, password } = req.body;

    validateRequiredString(firstName, "firstName");
    validateRequiredString(lastName, "lastName");
    validateRequiredString(email, "email");
    validateRequiredString(password, "password");
    validateMinLength(firstName, "firstName", 2);
    validateMinLength(lastName, "lastName", 2);
    validateEmail(email);
    validateMinLength(password, "password", 8);

    next();
  } catch (error) {
    next(error);
  }
};

const validateLogin = (req, _res, next) => {
  try {
    const { email, password } = req.body;

    validateRequiredString(email, "email");
    validateRequiredString(password, "password");
    validateEmail(email);

    next();
  } catch (error) {
    next(error);
  }
};

const authValidation = {
  validateRegister,
  validateLogin,
};

module.exports = authValidation;
