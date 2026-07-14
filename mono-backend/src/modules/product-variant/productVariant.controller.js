const productVariantService = require("./productVariant.service");

const getAll = async (req, res, next) => {
  try {
    const variants = await productVariantService.getAll();

    res.status(200).json({
      success: true,
      message: "Product variants retrieved successfully",
      data: variants,
    });
  } catch (error) {
    next(error);
  }
};

const getOne = async (req, res, next) => {
  try {
    const variant = await productVariantService.getOne(req.params.id);

    res.status(200).json({
      success: true,
      message: "Product variant retrieved successfully",
      data: variant,
    });
  } catch (error) {
    next(error);
  }
};

const create = async (req, res, next) => {
  try {
    const variant = await productVariantService.create(req.body);

    res.status(201).json({
      success: true,
      message: "Product variant created successfully",
      data: variant,
    });
  } catch (error) {
    next(error);
  }
};

const update = async (req, res, next) => {
  try {
    const variant = await productVariantService.update(req.params.id, req.body);

    res.status(200).json({
      success: true,
      message: "Product variant updated successfully",
      data: variant,
    });
  } catch (error) {
    next(error);
  }
};

const remove = async (req, res, next) => {
  try {
    const result = await productVariantService.remove(req.params.id);

    res.status(200).json({
      success: true,
      message: "Product variant deleted successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAll,
  getOne,
  create,
  update,
  remove,
};
