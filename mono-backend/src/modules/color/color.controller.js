const colorService = require("./color.service");

const getAll = async (req, res, next) => {
  try {
    const colors = await colorService.getAll();

    res.status(200).json({
      success: true,
      message: "Colors retrieved successfully",
      data: colors,
    });
  } catch (error) {
    next(error);
  }
};

const getOne = async (req, res, next) => {
  try {
    const color = await colorService.getOne(req.params.id);

    res.status(200).json({
      success: true,
      message: "Color retrieved successfully",
      data: color,
    });
  } catch (error) {
    next(error);
  }
};

const create = async (req, res, next) => {
  try {
    const color = await colorService.create(req.body);

    res.status(201).json({
      success: true,
      message: "Color created successfully",
      data: color,
    });
  } catch (error) {
    next(error);
  }
};

const update = async (req, res, next) => {
  try {
    const color = await colorService.update(req.params.id, req.body);

    res.status(200).json({
      success: true,
      message: "Color updated successfully",
      data: color,
    });
  } catch (error) {
    next(error);
  }
};

const remove = async (req, res, next) => {
  try {
    const result = await colorService.remove(req.params.id);

    res.status(200).json({
      success: true,
      message: "Color deleted successfully",
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
