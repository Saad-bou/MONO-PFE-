const aiTryOnService = require("./aiTryOn.service");

const create = async (req, res, next) => {
  try {
    const userId = req.user.id; // Ensure we only use req.user.id
    const history = await aiTryOnService.create(userId, req.body);

    res.status(202).json({
      success: true,
      message: "AI Try-On request accepted",
      data: history,
    });
  } catch (error) {
    next(error);
  }
};

const getByUser = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const history = await aiTryOnService.getByUser(userId);

    res.status(200).json({
      success: true,
      message: "AI Try-On history retrieved successfully",
      data: history,
    });
  } catch (error) {
    next(error);
  }
};

const getById = async (req, res, next) => {
  try {
    const history = await aiTryOnService.getById(req.params.id, req.user);

    res.status(200).json({
      success: true,
      message: "AI Try-On record retrieved successfully",
      data: history,
    });
  } catch (error) {
    next(error);
  }
};

const remove = async (req, res, next) => {
  try {
    await aiTryOnService.remove(req.params.id, req.user);

    res.status(200).json({
      success: true,
      message: "AI Try-On history deleted successfully",
      data: null,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  create,
  getByUser,
  getById,
  remove,
};
