const express = require("express");

const authMiddleware = require("../../middlewares/auth.middleware");
const aiTryOnController = require("./aiTryOn.controller");
const aiTryOnValidation = require("./aiTryOn.validation");

const aiTryOnRouter = express.Router();

// All endpoints require authMiddleware
aiTryOnRouter.use(authMiddleware);

aiTryOnRouter.post(
  "/",
  aiTryOnValidation.validateCreate,
  aiTryOnController.create
);

aiTryOnRouter.get("/", aiTryOnController.getByUser);

aiTryOnRouter.get("/:id", aiTryOnController.getById);

aiTryOnRouter.delete("/:id", aiTryOnController.remove);

module.exports = aiTryOnRouter;
