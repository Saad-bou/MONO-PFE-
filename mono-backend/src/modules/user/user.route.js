const express = require("express");

const authMiddleware = require("../../middlewares/auth.middleware");
const userController = require("./user.controller");
const userValidation = require("./user.validation");

const userRouter = express.Router();

userRouter.use(authMiddleware);

userRouter.get("/me", userController.getMe);

userRouter.patch(
  "/me",
  userValidation.validateUpdateProfile,
  userController.updateMe
);

userRouter.patch(
  "/change-password",
  userValidation.validateChangePassword,
  userController.changePassword
);

module.exports = userRouter;
