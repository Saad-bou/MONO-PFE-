const express = require("express");

const authMiddleware = require("../../middlewares/auth.middleware");
const { requireRole } = require("../../middlewares/auth.middleware");
const colorController = require("./color.controller");
const colorValidation = require("./color.validation");

const colorRouter = express.Router();

colorRouter.get("/", colorController.getAll);
colorRouter.get("/:id", colorController.getOne);

colorRouter.post(
  "/",
  authMiddleware,
  requireRole("ADMIN"),
  colorValidation.validateColorPayload,
  colorController.create,
);

colorRouter.put(
  "/:id",
  authMiddleware,
  requireRole("ADMIN"),
  colorValidation.validateColorPayload,
  colorController.update,
);

colorRouter.delete(
  "/:id",
  authMiddleware,
  requireRole("ADMIN"),
  colorController.remove,
);

module.exports = colorRouter;
