const express = require("express");

const authMiddleware = require("../../middlewares/auth.middleware");
const wishlistController = require("./wishlist.controller");
const wishlistValidation = require("./wishlist.validation");

const wishlistRouter = express.Router();

wishlistRouter.use(authMiddleware);

wishlistRouter.get("/", wishlistController.getMyWishlist);

wishlistRouter.post(
  "/",
  wishlistValidation.validateAddWishlistItem,
  wishlistController.addItem,
);

wishlistRouter.delete("/", wishlistController.clear);

wishlistRouter.delete("/:productId", wishlistController.removeItem);

module.exports = wishlistRouter;
