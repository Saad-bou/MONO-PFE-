const express = require("express");

const authMiddleware = require("../../middlewares/auth.middleware");
const {
  uploadAvatar,
  uploadProduct,
  uploadTryOn,
} = require("../../middlewares/upload.middleware");
const uploadController = require("./upload.controller");

const uploadRouter = express.Router();

uploadRouter.use(authMiddleware);

uploadRouter.post("/avatar", uploadAvatar, uploadController.uploadAvatar);
uploadRouter.post("/product", uploadProduct, uploadController.uploadProduct);
uploadRouter.post("/try-on", uploadTryOn, uploadController.uploadTryOn);

module.exports = uploadRouter;
