const productImageRepository = require("./productImage.repository");

const createError = (statusCode, message) => {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
};

const normalizeImageInput = (data) => {
  const normalized = {
    url: data.url.trim(),
    productId: data.productId.trim(),
    isMain: typeof data.isMain === "boolean" ? data.isMain : false,
    displayOrder:
      typeof data.displayOrder === "number" && Number.isInteger(data.displayOrder)
        ? data.displayOrder
        : 0,
  };

  if (typeof data.altText === "string" && data.altText.trim().length > 0) {
    normalized.altText = data.altText.trim();
  }

  return normalized;
};

const ensureProductExists = async (productId) => {
  const product = await productImageRepository.productExists(productId);

  if (!product) {
    throw createError(404, "Product not found");
  }
};

const getAll = async () => {
  return productImageRepository.getAllImages();
};

const getOne = async (id) => {
  const image = await productImageRepository.getImageById(id);

  if (!image) {
    throw createError(404, "Product image not found");
  }

  return image;
};

const getByProductId = async (productId) => {
  await ensureProductExists(productId);

  return productImageRepository.getImagesByProductId(productId);
};

const create = async (data) => {
  const cleanData = normalizeImageInput(data);

  await ensureProductExists(cleanData.productId);

  if (cleanData.isMain) {
    await productImageRepository.clearMainImage(cleanData.productId);
  }

  return productImageRepository.createImage(cleanData);
};

const update = async (id, data) => {
  const image = await productImageRepository.getImageById(id);

  if (!image) {
    throw createError(404, "Product image not found");
  }

  const cleanData = normalizeImageInput(data);

  await ensureProductExists(cleanData.productId);

  if (cleanData.isMain) {
    await productImageRepository.clearMainImage(cleanData.productId);
  }

  return productImageRepository.updateImage(id, cleanData);
};

const remove = async (id) => {
  const image = await productImageRepository.getImageById(id);

  if (!image) {
    throw createError(404, "Product image not found");
  }

  await productImageRepository.deleteImage(id);

  return { id };
};

module.exports = {
  getAll,
  getOne,
  getByProductId,
  create,
  update,
  remove,
};
