const express = require("express");

const authMiddleware = require("../../middlewares/auth.middleware");
const { requireRole } = require("../../middlewares/auth.middleware");
const orderController = require("./order.controller");
const orderValidation = require("./order.validation");

const orderRouter = express.Router();

orderRouter.use(authMiddleware);

orderRouter.post(
  "/checkout",
  orderValidation.validateCheckoutPayload,
  orderController.checkout,
);

orderRouter.get("/", orderController.getMyOrders);

orderRouter.get("/admin", requireRole("ADMIN"), orderController.getAllOrders);

orderRouter.get("/:id", orderController.getOrderById);

orderRouter.patch(
  "/:id/status",
  requireRole("ADMIN"),
  orderValidation.validateUpdateStatusPayload,
  orderController.updateStatus,
);

module.exports = orderRouter;
