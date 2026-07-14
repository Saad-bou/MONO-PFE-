const express = require("express");

const authMiddleware = require("../../middlewares/auth.middleware");
const cartController = require("./cart.controller");
const cartValidation = require("./cart.validation");

const cartRouter = express.Router();

cartRouter.use(authMiddleware);

cartRouter.get("/", cartController.getMyCart);

cartRouter.post(
  "/",
  cartValidation.validateAddCartItem,
  cartController.addItem,
);

cartRouter.put(
  "/:variantId",
  cartValidation.validateUpdateCartItem,
  cartController.updateItem,
);

cartRouter.delete("/", cartController.clear);

cartRouter.delete("/:variantId", cartController.removeItem);

module.exports = cartRouter;
