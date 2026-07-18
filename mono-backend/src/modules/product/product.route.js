const express = require("express");

const authMiddleware = require("../../middlewares/auth.middleware");
const { requireRole } = require("../../middlewares/auth.middleware");
const productController = require("./product.controller");
const productValidation = require("./product.validation");

const productRouter = express.Router();

productRouter.get(
  "/",
  productValidation.validateCatalogQuery,
  productController.getAll,
);

productRouter.get(
  "/featured",
  productValidation.validateCatalogQuery,
  productController.getFeatured,
);

productRouter.get(
  "/search",
  productValidation.validateSearchQuery,
  productController.getSearch,
);

productRouter.get("/slug/:slug", productController.getBySlug);

productRouter.get("/:id", productController.getOne);

productRouter.post(
  "/",
  authMiddleware,
   requireRole("ADMIN"),
  productValidation.validateProductPayload,
  productController.create,
);

productRouter.put(
  "/:id",
  authMiddleware,
   requireRole("ADMIN"),
  productValidation.validateProductPayload,
  productController.update,
);

productRouter.delete(
  "/:id",
  authMiddleware,
   requireRole("ADMIN"),
  productController.remove,
);

module.exports = productRouter;
