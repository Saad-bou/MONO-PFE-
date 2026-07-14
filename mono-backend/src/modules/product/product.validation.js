const createValidationError = (message) => {
  const error = new Error(message);
  error.statusCode = 400;
  return error;
};

const ALLOWED_SORTS = new Set([
  "price_asc",
  "price_desc",
  "newest",
  "oldest",
  "name_asc",
  "name_desc",
]);

const validateProductPayload = (req, res, next) => {
  try {
    const {
      sku,
      name,
      description,
      price,
      categoryId,
      brand,
      material,
      careInstructions,
      isFeatured,
      isActive,
    } = req.body;

    if (typeof sku !== "string" || sku.trim().length === 0) {
      throw createValidationError("sku is required");
    }

    if (typeof name !== "string" || name.trim().length === 0) {
      throw createValidationError("name is required");
    }

    if (typeof description !== "string" || description.trim().length === 0) {
      throw createValidationError("description is required");
    }

    if (typeof price !== "number" || price <= 0) {
      throw createValidationError("price must be greater than zero");
    }

    if (typeof categoryId !== "string" || categoryId.trim().length === 0) {
      throw createValidationError("categoryId is required");
    }

    if (brand !== undefined && (typeof brand !== "string" || brand.trim().length === 0)) {
      throw createValidationError("brand must be a non-empty string");
    }

    if (
      material !== undefined &&
      (typeof material !== "string" || material.trim().length === 0)
    ) {
      throw createValidationError("material must be a non-empty string");
    }

    if (
      careInstructions !== undefined &&
      (typeof careInstructions !== "string" || careInstructions.trim().length === 0)
    ) {
      throw createValidationError("careInstructions must be a non-empty string");
    }

    if (isFeatured !== undefined && typeof isFeatured !== "boolean") {
      throw createValidationError("isFeatured must be a boolean");
    }

    if (isActive !== undefined && typeof isActive !== "boolean") {
      throw createValidationError("isActive must be a boolean");
    }

    next();
  } catch (error) {
    next(error);
  }
};

const validateCatalogQuery = (req, res, next) => {
  try {
    const { page, limit, sort, featured, minPrice, maxPrice, search } = req.query;

    if (page !== undefined) {
      const parsedPage = Number.parseInt(page, 10);

      if (!Number.isInteger(parsedPage) || parsedPage < 1) {
        throw createValidationError("page must be an integer greater than or equal to 1");
      }
    }

    if (limit !== undefined) {
      const parsedLimit = Number.parseInt(limit, 10);

      if (!Number.isInteger(parsedLimit) || parsedLimit < 1) {
        throw createValidationError("limit must be an integer greater than or equal to 1");
      }
    }

    if (sort !== undefined && !ALLOWED_SORTS.has(sort)) {
      throw createValidationError("sort is invalid");
    }

    if (
      featured !== undefined &&
      !["true", "false", "1", "0"].includes(String(featured).toLowerCase())
    ) {
      throw createValidationError("featured must be a boolean");
    }

    if (minPrice !== undefined) {
      const parsedMinPrice = Number(minPrice);

      if (Number.isNaN(parsedMinPrice) || parsedMinPrice < 0) {
        throw createValidationError("minPrice must be a number greater than or equal to zero");
      }
    }

    if (maxPrice !== undefined) {
      const parsedMaxPrice = Number(maxPrice);

      if (Number.isNaN(parsedMaxPrice) || parsedMaxPrice < 0) {
        throw createValidationError("maxPrice must be a number greater than or equal to zero");
      }
    }

    if (
      minPrice !== undefined &&
      maxPrice !== undefined &&
      Number(minPrice) > Number(maxPrice)
    ) {
      throw createValidationError("minPrice cannot be greater than maxPrice");
    }

    if (search !== undefined && (typeof search !== "string" || search.trim().length === 0)) {
      throw createValidationError("search must be a non-empty string");
    }

    next();
  } catch (error) {
    next(error);
  }
};

const validateSearchQuery = (req, res, next) => {
  try {
    const searchValue = req.query.search ?? req.query.q;

    if (typeof searchValue !== "string" || searchValue.trim().length === 0) {
      throw createValidationError("search is required");
    }

    return validateCatalogQuery(req, res, next);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  validateProductPayload,
  validateCatalogQuery,
  validateSearchQuery,
};
