const express = require("express");

const authMiddleware = require("../../middlewares/auth.middleware");
const { requireRole } = require("../../middlewares/auth.middleware");
const productImageController = require("./productImage.controller");
const productImageValidation = require("./productImage.validation");

const productImageRouter = express.Router();

productImageRouter.get("/", productImageController.getAll);
productImageRouter.get("/product/:productId", productImageController.getByProductId);
productImageRouter.get("/:id", productImageController.getOne);

productImageRouter.post(
  "/",
  authMiddleware,
  requireRole("ADMIN"),
  productImageValidation.validateProductImagePayload,
  productImageController.create,
);

productImageRouter.put(
  "/:id",
  authMiddleware,
  requireRole("ADMIN"),
  productImageValidation.validateProductImagePayload,
  productImageController.update,
);

productImageRouter.delete(
  "/:id",
  authMiddleware,
  requireRole("ADMIN"),
  productImageController.remove,
);

module.exports = productImageRouter;
