const express = require("express");

const authMiddleware = require("../../middlewares/auth.middleware");
const { requireRole } = require("../../middlewares/auth.middleware");
const productVariantController = require("./productVariant.controller");
const productVariantValidation = require("./productVariant.validation");

const productVariantRouter = express.Router();

productVariantRouter.get("/", productVariantController.getAll);
productVariantRouter.get("/:id", productVariantController.getOne);

productVariantRouter.post(
  "/",
  authMiddleware,
  //requireRole("ADMIN"),
  productVariantValidation.validateProductVariantPayload,
  productVariantController.create,
);

productVariantRouter.put(
  "/:id",
  authMiddleware,
  //requireRole("ADMIN"),
  productVariantValidation.validateProductVariantPayload,
  productVariantController.update,
);

productVariantRouter.delete(
  "/:id",
  authMiddleware,
  //requireRole("ADMIN"),
  productVariantController.remove,
);

module.exports = productVariantRouter;
