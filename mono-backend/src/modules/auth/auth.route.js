const express = require("express");

const authMiddleware = require("../../middlewares/auth.middleware");
const authController = require("./auth.controller");
const authValidation = require("./auth.validation");

const authRouter = express.Router();

authRouter.post(
  "/register",
  authValidation.validateRegister,
  authController.register,
);

authRouter.post(
  "/login",
  authValidation.validateLogin,
  authController.login,
);

authRouter.get("/me", authMiddleware, authController.getMe);

module.exports = authRouter;
