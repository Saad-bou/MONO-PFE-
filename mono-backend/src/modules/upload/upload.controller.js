const uploadService = require("./upload.service");

const uploadAvatar = async (req, res, next) => {
  try {
    const data = uploadService.uploadAvatar(req.file);

    res.status(201).json({
      success: true,
      message: "Avatar uploaded successfully",
      data,
    });
  } catch (error) {
    next(error);
  }
};

const uploadProduct = async (req, res, next) => {
  try {
    const data = uploadService.uploadProduct(req.file);

    res.status(201).json({
      success: true,
      message: "Product image uploaded successfully",
      data,
    });
  } catch (error) {
    next(error);
  }
};

const uploadTryOn = async (req, res, next) => {
  try {
    const data = uploadService.uploadTryOn(req.file);

    res.status(201).json({
      success: true,
      message: "Try-on image uploaded successfully",
      data,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  uploadAvatar,
  uploadProduct,
  uploadTryOn,
};
