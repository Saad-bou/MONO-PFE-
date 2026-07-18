const express = require("express");

const authMiddleware = require("../../middlewares/auth.middleware");
const { requireRole } = require("../../middlewares/auth.middleware");
const sizeController = require("./size.controller");
const sizeValidation = require("./size.validation");

const sizeRouter = express.Router();

sizeRouter.get("/", sizeController.getAll);
sizeRouter.get("/:id", sizeController.getOne);

sizeRouter.post(
  "/",
  authMiddleware,
  requireRole("ADMIN"),
  sizeValidation.validateSizePayload,
  sizeController.create,
);

sizeRouter.put(
  "/:id",
  authMiddleware,
  requireRole("ADMIN"),
  sizeValidation.validateSizePayload,
  sizeController.update,
);

sizeRouter.delete(
  "/:id",
  authMiddleware,
  requireRole("ADMIN"),
  sizeController.remove,
);

module.exports = sizeRouter;
