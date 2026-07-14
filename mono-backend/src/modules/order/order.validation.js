const { ALLOWED_STATUSES } = require("./order.service");

const createValidationError = (message) => {
  const error = new Error(message);
  error.statusCode = 400;
  return error;
};

const ALLOWED_PAYMENT_METHODS = new Set(["CASH_ON_DELIVERY"]);

const validateCheckoutPayload = (req, res, next) => {
  try {
    const { shippingAddress, paymentMethod } = req.body;

    if (typeof shippingAddress !== "string" || shippingAddress.trim().length === 0) {
      throw createValidationError("shippingAddress is required");
    }

    if (typeof paymentMethod !== "string" || paymentMethod.trim().length === 0) {
      throw createValidationError("paymentMethod is required");
    }

    if (!ALLOWED_PAYMENT_METHODS.has(paymentMethod.trim())) {
      throw createValidationError("paymentMethod must be CASH_ON_DELIVERY");
    }

    req.body.shippingAddress = shippingAddress.trim();
    req.body.paymentMethod = paymentMethod.trim();

    next();
  } catch (error) {
    next(error);
  }
};

const validateUpdateStatusPayload = (req, res, next) => {
  try {
    const { status } = req.body;

    if (typeof status !== "string" || status.trim().length === 0) {
      throw createValidationError("status is required");
    }

    const normalizedStatus = status.trim().toUpperCase();

    if (!ALLOWED_STATUSES.has(normalizedStatus)) {
      throw createValidationError("Invalid order status");
    }

    req.body.status = normalizedStatus;

    next();
  } catch (error) {
    next(error);
  }
};

module.exports = {
  validateCheckoutPayload,
  validateUpdateStatusPayload,
};
