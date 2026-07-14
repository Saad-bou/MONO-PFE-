const collectionService = require("./collection.service");

const getAll = async (req, res, next) => {
  try {
    const collections = await collectionService.getAll();

    res.status(200).json({
      success: true,
      message: "Collections retrieved successfully",
      data: collections,
    });
  } catch (error) {
    next(error);
  }
};

const getOne = async (req, res, next) => {
  try {
    const collection = await collectionService.getOne(req.params.id);

    res.status(200).json({
      success: true,
      message: "Collection retrieved successfully",
      data: collection,
    });
  } catch (error) {
    next(error);
  }
};

const create = async (req, res, next) => {
  try {
    const collection = await collectionService.create(req.body);

    res.status(201).json({
      success: true,
      message: "Collection created successfully",
      data: collection,
    });
  } catch (error) {
    next(error);
  }
};

const update = async (req, res, next) => {
  try {
    const collection = await collectionService.update(req.params.id, req.body);

    res.status(200).json({
      success: true,
      message: "Collection updated successfully",
      data: collection,
    });
  } catch (error) {
    next(error);
  }
};

const remove = async (req, res, next) => {
  try {
    const result = await collectionService.remove(req.params.id);

    res.status(200).json({
      success: true,
      message: "Collection deleted successfully",
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
