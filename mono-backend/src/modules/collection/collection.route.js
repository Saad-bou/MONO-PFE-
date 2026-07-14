const express = require("express");

const authMiddleware = require("../../middlewares/auth.middleware");
const { requireRole } = require("../../middlewares/auth.middleware");
const collectionController = require("./collection.controller");
const collectionValidation = require("./collection.validation");

const collectionRouter = express.Router();

collectionRouter.get("/", collectionController.getAll);
collectionRouter.get("/:id", collectionController.getOne);

collectionRouter.post(
  "/",
  authMiddleware,
  //requireRole("ADMIN"),
  collectionValidation.validateCollectionPayload,
  collectionController.create,
);

collectionRouter.put(
  "/:id",
  authMiddleware,
  //requireRole("ADMIN"),
  collectionValidation.validateCollectionPayload,
  collectionController.update,
);

collectionRouter.delete(
  "/:id",
  authMiddleware,
  //requireRole("ADMIN"),
  collectionController.remove,
);

module.exports = collectionRouter;
