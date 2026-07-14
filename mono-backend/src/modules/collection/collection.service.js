const collectionRepository = require("./collection.repository");

const createError = (statusCode, message) => {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
};

const generateSlug = (name) => {
  return name
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
};

const resolveSlug = (name, providedSlug) => {
  if (providedSlug) {
    return providedSlug;
  }

  return generateSlug(name);
};

const normalizeCollectionInput = (data) => {
  const name = data.name.trim();
  const providedSlug =
    typeof data.slug === "string" && data.slug.trim().length > 0
      ? data.slug.trim()
      : undefined;

  const normalized = {
    name,
    slug: resolveSlug(name, providedSlug),
    description: data.description ? data.description.trim() : undefined,
    image: data.image ? data.image.trim() : undefined,
  };

  if (typeof data.isFeatured === "boolean") {
    normalized.isFeatured = data.isFeatured;
  }

  return normalized;
};

const getAll = async () => {
  return collectionRepository.getAllCollections();
};

const getOne = async (id) => {
  const collection = await collectionRepository.getCollectionById(id);

  if (!collection) {
    throw createError(404, "Collection not found");
  }

  return collection;
};

const create = async (data) => {
  const cleanData = normalizeCollectionInput(data);
  const existingByName = await collectionRepository.getCollectionByName(cleanData.name);

  if (existingByName) {
    throw createError(409, "Collection name already exists");
  }

  const existingBySlug = await collectionRepository.getCollectionBySlug(cleanData.slug);

  if (existingBySlug) {
    throw createError(409, "Collection slug already exists");
  }

  return collectionRepository.createCollection(cleanData);
};

const update = async (id, data) => {
  const collection = await collectionRepository.getCollectionById(id);

  if (!collection) {
    throw createError(404, "Collection not found");
  }

  const cleanData = normalizeCollectionInput(data);
  const existingByName = await collectionRepository.getCollectionByName(cleanData.name);

  if (existingByName && existingByName.id !== id) {
    throw createError(409, "Collection name already exists");
  }

  const existingBySlug = await collectionRepository.getCollectionBySlug(cleanData.slug);

  if (existingBySlug && existingBySlug.id !== id) {
    throw createError(409, "Collection slug already exists");
  }

  return collectionRepository.updateCollection(id, cleanData);
};

const remove = async (id) => {
  const collection = await collectionRepository.getCollectionById(id);

  if (!collection) {
    throw createError(404, "Collection not found");
  }

  await collectionRepository.deleteCollection(id);

  return { id };
};

module.exports = {
  getAll,
  getOne,
  create,
  update,
  remove,
};
