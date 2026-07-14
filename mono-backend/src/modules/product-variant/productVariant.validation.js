const createValidationError = (message) => {
  const error = new Error(message);
  error.statusCode = 400;
  return error;
};

const validateProductVariantPayload = (req, res, next) => {
  try {
    const { sku, stock, productId, colorId, sizeId, price, barcode, imageId } = req.body;

    if (typeof sku !== "string" || sku.trim().length === 0) {
      throw createValidationError("sku is required");
    }

    if (typeof stock !== "number" || !Number.isInteger(stock) || stock < 0) {
      throw createValidationError("stock must be an integer greater than or equal to zero");
    }

    if (typeof productId !== "string" || productId.trim().length === 0) {
      throw createValidationError("productId is required");
    }

    if (typeof colorId !== "string" || colorId.trim().length === 0) {
      throw createValidationError("colorId is required");
    }

    if (typeof sizeId !== "string" || sizeId.trim().length === 0) {
      throw createValidationError("sizeId is required");
    }

    if (price !== undefined && (typeof price !== "number" || price <= 0)) {
      throw createValidationError("price must be greater than zero");
    }

    if (barcode !== undefined && (typeof barcode !== "string" || barcode.trim().length === 0)) {
      throw createValidationError("barcode must be a non-empty string");
    }

    if (imageId !== undefined && (typeof imageId !== "string" || imageId.trim().length === 0)) {
      throw createValidationError("imageId must be a non-empty string");
    }

    next();
  } catch (error) {
    next(error);
  }
};

module.exports = {
  validateProductVariantPayload,
};
