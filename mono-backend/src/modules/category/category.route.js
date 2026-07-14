const express = require("express");

const authMiddleware = require("../../middlewares/auth.middleware");
const { requireRole } = require("../../middlewares/auth.middleware");
const categoryController = require("./category.controller");
const categoryValidation = require("./category.validation");

const categoryRouter = express.Router();

categoryRouter.get("/", categoryController.getAll);
categoryRouter.get("/:id", categoryController.getOne);

categoryRouter.post(
  "/",
  authMiddleware,
  //requireRole("ADMIN"),
  categoryValidation.validateCategoryPayload,
  categoryController.create,
);

categoryRouter.put(
  "/:id",
  authMiddleware,
  //requireRole("ADMIN"),
  categoryValidation.validateCategoryPayload,
  categoryController.update,
);

categoryRouter.delete(
  "/:id",
  authMiddleware,
  //requireRole("ADMIN"),
  categoryController.remove,
);

module.exports = categoryRouter;
