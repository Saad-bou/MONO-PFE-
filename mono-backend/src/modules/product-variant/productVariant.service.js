const productVariantRepository = require("./productVariant.repository");

const createError = (statusCode, message) => {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
};

const normalizeVariantInput = (data) => {
  const normalized = {
    sku: data.sku.trim(),
    stock: data.stock,
    productId: data.productId.trim(),
    colorId: data.colorId.trim(),
    sizeId: data.sizeId.trim(),
  };

  if (typeof data.price === "number") {
    normalized.price = data.price;
  }

  if (typeof data.barcode === "string" && data.barcode.trim().length > 0) {
    normalized.barcode = data.barcode.trim();
  }

  if (typeof data.imageId === "string" && data.imageId.trim().length > 0) {
    normalized.imageId = data.imageId.trim();
  }

  return normalized;
};

const ensureProductExists = async (productId) => {
  const product = await productVariantRepository.productExists(productId);

  if (!product) {
    throw createError(404, "Product not found");
  }
};

const ensureColorExists = async (colorId) => {
  const color = await productVariantRepository.colorExists(colorId);

  if (!color) {
    throw createError(404, "Color not found");
  }
};

const ensureSizeExists = async (sizeId) => {
  const size = await productVariantRepository.sizeExists(sizeId);

  if (!size) {
    throw createError(404, "Size not found");
  }
};

const ensureImageExists = async (imageId) => {
  const image = await productVariantRepository.imageExists(imageId);

  if (!image) {
    throw createError(404, "Product image not found");
  }
};

const ensureRelatedResourcesExist = async (cleanData) => {
  await ensureProductExists(cleanData.productId);
  await ensureColorExists(cleanData.colorId);
  await ensureSizeExists(cleanData.sizeId);

  if (cleanData.imageId) {
    await ensureImageExists(cleanData.imageId);
  }
};

const ensureUniqueConstraints = async (cleanData, excludeId = null) => {
  const existingBySku = await productVariantRepository.getVariantBySku(cleanData.sku);

  if (existingBySku && existingBySku.id !== excludeId) {
    throw createError(409, "Product variant sku already exists");
  }

  if (cleanData.barcode) {
    const existingByBarcode = await productVariantRepository.getVariantByBarcode(
      cleanData.barcode,
    );

    if (existingByBarcode && existingByBarcode.id !== excludeId) {
      throw createError(409, "Product variant barcode already exists");
    }
  }

  const existingByCombination = await productVariantRepository.getVariantByCombination(
    cleanData.productId,
    cleanData.colorId,
    cleanData.sizeId,
  );

  if (existingByCombination && existingByCombination.id !== excludeId) {
    throw createError(409, "Product variant combination already exists");
  }
};

const getAll = async () => {
  return productVariantRepository.getAllVariants();
};

const getOne = async (id) => {
  const variant = await productVariantRepository.getVariantById(id);

  if (!variant) {
    throw createError(404, "Product variant not found");
  }

  return variant;
};

const create = async (data) => {
  const cleanData = normalizeVariantInput(data);

  await ensureRelatedResourcesExist(cleanData);
  await ensureUniqueConstraints(cleanData);

  return productVariantRepository.createVariant(cleanData);
};

const update = async (id, data) => {
  const variant = await productVariantRepository.getVariantById(id);

  if (!variant) {
    throw createError(404, "Product variant not found");
  }

  const cleanData = normalizeVariantInput(data);

  await ensureRelatedResourcesExist(cleanData);
  await ensureUniqueConstraints(cleanData, id);

  return productVariantRepository.updateVariant(id, cleanData);
};

const remove = async (id) => {
  const variant = await productVariantRepository.getVariantById(id);

  if (!variant) {
    throw createError(404, "Product variant not found");
  }

  await productVariantRepository.deleteVariant(id);

  return { id };
};

module.exports = {
  getAll,
  getOne,
  create,
  update,
  remove,
};
