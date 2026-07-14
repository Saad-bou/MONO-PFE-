const categoryRepository = require("./category.repository");

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

const normalizeCategoryInput = (data) => {
  const name = data.name.trim();
  const providedSlug =
    typeof data.slug === "string" && data.slug.trim().length > 0
      ? data.slug.trim()
      : undefined;

  return {
    name,
    slug: resolveSlug(name, providedSlug),
    description: data.description ? data.description.trim() : undefined,
    image: data.image ? data.image.trim() : undefined,
  };
};

const getAll = async () => {
  return categoryRepository.getAllCategories();
};

const getOne = async (id) => {
  const category = await categoryRepository.getCategoryById(id);

  if (!category) {
    throw createError(404, "Category not found");
  }

  return category;
};

const create = async (data) => {
  const cleanData = normalizeCategoryInput(data);
  const existingCategory = await categoryRepository.getCategoryByName(cleanData.name);

  if (existingCategory) {
    throw createError(409, "Category name already exists");
  }

  const existingBySlug = await categoryRepository.getCategoryBySlug(cleanData.slug);

  if (existingBySlug) {
    throw createError(409, "Category slug already exists");
  }

  return categoryRepository.createCategory(cleanData);
};

const update = async (id, data) => {
  const category = await categoryRepository.getCategoryById(id);

  if (!category) {
    throw createError(404, "Category not found");
  }

  const cleanData = normalizeCategoryInput(data);
  const existingCategory = await categoryRepository.getCategoryByName(cleanData.name);

  if (existingCategory && existingCategory.id !== id) {
    throw createError(409, "Category name already exists");
  }

  const existingBySlug = await categoryRepository.getCategoryBySlug(cleanData.slug);

  if (existingBySlug && existingBySlug.id !== id) {
    throw createError(409, "Category slug already exists");
  }

  return categoryRepository.updateCategory(id, cleanData);
};

const remove = async (id) => {
  const category = await categoryRepository.getCategoryById(id);

  if (!category) {
    throw createError(404, "Category not found");
  }

  const productCount = await categoryRepository.countProductsByCategoryId(id);

  if (productCount > 0) {
    throw createError(409, "Cannot delete category with existing products");
  }

  await categoryRepository.deleteCategory(id);

  return { id };
};

module.exports = {
  getAll,
  getOne,
  create,
  update,
  remove,
};
