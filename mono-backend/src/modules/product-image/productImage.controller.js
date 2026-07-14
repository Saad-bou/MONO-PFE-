const productImageService = require("./productImage.service");

const getAll = async (req, res, next) => {
  try {
    const images = await productImageService.getAll();

    res.status(200).json({
      success: true,
      message: "Product images retrieved successfully",
      data: images,
    });
  } catch (error) {
    next(error);
  }
};

const getOne = async (req, res, next) => {
  try {
    const image = await productImageService.getOne(req.params.id);

    res.status(200).json({
      success: true,
      message: "Product image retrieved successfully",
      data: image,
    });
  } catch (error) {
    next(error);
  }
};

const getByProductId = async (req, res, next) => {
  try {
    const images = await productImageService.getByProductId(req.params.productId);

    res.status(200).json({
      success: true,
      message: "Product images retrieved successfully",
      data: images,
    });
  } catch (error) {
    next(error);
  }
};

const create = async (req, res, next) => {
  try {
    const image = await productImageService.create(req.body);

    res.status(201).json({
      success: true,
      message: "Product image created successfully",
      data: image,
    });
  } catch (error) {
    next(error);
  }
};

const update = async (req, res, next) => {
  try {
    const image = await productImageService.update(req.params.id, req.body);

    res.status(200).json({
      success: true,
      message: "Product image updated successfully",
      data: image,
    });
  } catch (error) {
    next(error);
  }
};

const remove = async (req, res, next) => {
  try {
    const result = await productImageService.remove(req.params.id);

    res.status(200).json({
      success: true,
      message: "Product image deleted successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAll,
  getOne,
  getByProductId,
  create,
  update,
  remove,
};
