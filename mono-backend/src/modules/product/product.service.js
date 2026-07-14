const productRepository = require("./product.repository");

const createError = (statusCode, message) => {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
};

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 12;

const SORT_OPTIONS = {
  price_asc: { price: "asc" },
  price_desc: { price: "desc" },
  newest: { createdAt: "desc" },
  oldest: { createdAt: "asc" },
  name_asc: { name: "asc" },
  name_desc: { name: "desc" },
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

const normalizeProductInput = (data) => {
  const name = data.name.trim();

  const normalized = {
    sku: data.sku.trim(),
    name,
    slug: generateSlug(name),
    description: data.description.trim(),
    price: data.price,
    categoryId: data.categoryId.trim(),
  };

  if (typeof data.brand === "string" && data.brand.trim().length > 0) {
    normalized.brand = data.brand.trim();
  }

  if (typeof data.material === "string" && data.material.trim().length > 0) {
    normalized.material = data.material.trim();
  }

  if (typeof data.careInstructions === "string" && data.careInstructions.trim().length > 0) {
    normalized.careInstructions = data.careInstructions.trim();
  }

  if (typeof data.isFeatured === "boolean") {
    normalized.isFeatured = data.isFeatured;
  }

  if (typeof data.isActive === "boolean") {
    normalized.isActive = data.isActive;
  }

  return normalized;
};

const ensureCategoryExists = async (categoryId) => {
  const category = await productRepository.categoryExists(categoryId);

  if (!category) {
    throw createError(404, "Category not found");
  }
};

const parsePositiveInt = (value, fallback) => {
  const parsed = Number.parseInt(value, 10);

  if (!Number.isInteger(parsed) || parsed < 1) {
    return fallback;
  }

  return parsed;
};

const parseOptionalNumber = (value) => {
  if (value === undefined || value === null || value === "") {
    return undefined;
  }

  const parsed = Number(value);

  if (Number.isNaN(parsed)) {
    return undefined;
  }

  return parsed;
};

const parseFeatured = (value) => {
  if (value === undefined || value === null || value === "") {
    return undefined;
  }

  if (value === true || value === "true" || value === "1") {
    return true;
  }

  if (value === false || value === "false" || value === "0") {
    return false;
  }

  return undefined;
};

const normalizeCatalogQuery = (query = {}) => {
  const page = parsePositiveInt(query.page, DEFAULT_PAGE);
  const limit = parsePositiveInt(query.limit, DEFAULT_LIMIT);
  const sortKey =
    typeof query.sort === "string" && SORT_OPTIONS[query.sort] ? query.sort : "newest";

  return {
    page,
    limit,
    skip: (page - 1) * limit,
    take: limit,
    orderBy: SORT_OPTIONS[sortKey],
    category:
      typeof query.category === "string" && query.category.trim().length > 0
        ? query.category.trim()
        : undefined,
    collection:
      typeof query.collection === "string" && query.collection.trim().length > 0
        ? query.collection.trim()
        : undefined,
    featured: parseFeatured(query.featured),
    minPrice: parseOptionalNumber(query.minPrice),
    maxPrice: parseOptionalNumber(query.maxPrice),
    search:
      typeof query.search === "string" && query.search.trim().length > 0
        ? query.search.trim()
        : undefined,
  };
};

const buildPagination = (page, limit, total) => {
  return {
    page,
    limit,
    total,
    totalPages: total === 0 ? 0 : Math.ceil(total / limit),
  };
};

const getCatalog = async (query = {}) => {
  const normalized = normalizeCatalogQuery(query);
  const where = productRepository.buildCatalogWhere(normalized);
  const { data, total } = await productRepository.getCatalogProducts({
    where,
    orderBy: normalized.orderBy,
    skip: normalized.skip,
    take: normalized.take,
  });

  return {
    data,
    pagination: buildPagination(normalized.page, normalized.limit, total),
  };
};

const getFeatured = async (query = {}) => {
  return getCatalog({
    ...query,
    featured: true,
  });
};

const getSearch = async (query = {}) => {
  const search =
    typeof query.search === "string" && query.search.trim().length > 0
      ? query.search.trim()
      : typeof query.q === "string" && query.q.trim().length > 0
        ? query.q.trim()
        : undefined;

  if (!search) {
    throw createError(400, "search is required");
  }

  return getCatalog({
    ...query,
    search,
  });
};

const getBySlug = async (slug) => {
  const product = await productRepository.getCatalogProductBySlug(slug);

  if (!product) {
    throw createError(404, "Product not found");
  }

  return product;
};

const getAll = async () => {
  return productRepository.getAllProducts();
};

const getOne = async (id) => {
  const product = await productRepository.getProductById(id);

  if (!product) {
    throw createError(404, "Product not found");
  }

  return product;
};

const create = async (data) => {
  const cleanData = normalizeProductInput(data);

  await ensureCategoryExists(cleanData.categoryId);

  const existingBySku = await productRepository.getProductBySku(cleanData.sku);

  if (existingBySku) {
    throw createError(409, "Product sku already exists");
  }

  const existingBySlug = await productRepository.getProductBySlug(cleanData.slug);

  if (existingBySlug) {
    throw createError(409, "Product slug already exists");
  }

  return productRepository.createProduct(cleanData);
};

const update = async (id, data) => {
  const product = await productRepository.getProductById(id);

  if (!product) {
    throw createError(404, "Product not found");
  }

  const cleanData = normalizeProductInput(data);

  await ensureCategoryExists(cleanData.categoryId);

  const existingBySku = await productRepository.getProductBySku(cleanData.sku);

  if (existingBySku && existingBySku.id !== id) {
    throw createError(409, "Product sku already exists");
  }

  const existingBySlug = await productRepository.getProductBySlug(cleanData.slug);

  if (existingBySlug && existingBySlug.id !== id) {
    throw createError(409, "Product slug already exists");
  }

  return productRepository.updateProduct(id, cleanData);
};

const remove = async (id) => {
  const product = await productRepository.getProductById(id);

  if (!product) {
    throw createError(404, "Product not found");
  }

  await productRepository.deleteProduct(id);

  return { id };
};

module.exports = {
  getCatalog,
  getFeatured,
  getSearch,
  getBySlug,
  getAll,
  getOne,
  create,
  update,
  remove,
};
