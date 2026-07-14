const sizeService = require("./size.service");

const getAll = async (req, res, next) => {
  try {
    const sizes = await sizeService.getAll();

    res.status(200).json({
      success: true,
      message: "Sizes retrieved successfully",
      data: sizes,
    });
  } catch (error) {
    next(error);
  }
};

const getOne = async (req, res, next) => {
  try {
    const size = await sizeService.getOne(req.params.id);

    res.status(200).json({
      success: true,
      message: "Size retrieved successfully",
      data: size,
    });
  } catch (error) {
    next(error);
  }
};

const create = async (req, res, next) => {
  try {
    const size = await sizeService.create(req.body);

    res.status(201).json({
      success: true,
      message: "Size created successfully",
      data: size,
    });
  } catch (error) {
    next(error);
  }
};

const update = async (req, res, next) => {
  try {
    const size = await sizeService.update(req.params.id, req.body);

    res.status(200).json({
      success: true,
      message: "Size updated successfully",
      data: size,
    });
  } catch (error) {
    next(error);
  }
};

const remove = async (req, res, next) => {
  try {
    const result = await sizeService.remove(req.params.id);

    res.status(200).json({
      success: true,
      message: "Size deleted successfully",
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
