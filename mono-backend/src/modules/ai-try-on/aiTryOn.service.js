const aiTryOnRepository = require("./aiTryOn.repository");
const { createAIProvider } = require("../../providers/ai/aiProviderFactory");

const resolveGarmentImage = (product) => {
  if (!product.images || product.images.length === 0) {
    const error = new Error("Product image not found");
    error.statusCode = 400;
    throw error;
  }

  const mainImage = product.images.find((image) => image.isMain);
  return (mainImage || product.images[0]).url;
};

const create = async (userId, payload) => {
  const { productId, userImage } = payload;

  const product = await aiTryOnRepository.findProductById(productId);
  if (!product) {
    const error = new Error("Product not found");
    error.statusCode = 404;
    throw error;
  }

  const garmentImage = resolveGarmentImage(product);

  const data = {
    userId,
    productId,
    userImage,
    generatedImage: "",
    status: "PROCESSING",
  };

  const history = await aiTryOnRepository.create(data);

  try {
    const provider = createAIProvider();
    console.log("[AI Try-On] before generateTryOn:", {
      historyId: history.id,
      provider: provider.constructor.name,
      personImage: userImage,
      garmentImage,
    });

    const tryOnResult = await provider.generateTryOn({
      personImage: userImage,
      garmentImage,
    });

    console.log("[AI Try-On] after generateTryOn:", {
      historyId: history.id,
      provider: tryOnResult.provider,
      status: tryOnResult.status,
      generatedImage: tryOnResult.generatedImage,
    });

    const updatedHistory = await aiTryOnRepository.update(history.id, {
      generatedImage: tryOnResult.generatedImage,
      status: "SUCCESS",
    });

    console.log("[AI Try-On] repository.update SUCCESS:", {
      historyId: updatedHistory.id,
      status: updatedHistory.status,
      generatedImage: updatedHistory.generatedImage,
    });

    return updatedHistory;
  } catch (error) {
    console.error("[AI Try-On] generateTryOn failed:", error);

    const failedHistory = await aiTryOnRepository.update(history.id, {
      status: "FAILED",
    });

    console.log("[AI Try-On] repository.update FAILED:", {
      historyId: failedHistory.id,
      status: failedHistory.status,
    });

    return failedHistory;
  }
};

const getByUser = async (userId) => {
  return await aiTryOnRepository.findByUser(userId);
};

const getById = async (id, user) => {
  const history = await aiTryOnRepository.findById(id);
  if (!history) {
    const error = new Error("AI Try-On history not found");
    error.statusCode = 404;
    throw error;
  }

  const roleName = user.role && user.role.name;
  if (history.userId !== user.id && roleName !== "ADMIN") {
    const error = new Error("Forbidden");
    error.statusCode = 403;
    throw error;
  }

  return history;
};

const remove = async (id, user) => {
  const history = await aiTryOnRepository.findById(id);
  if (!history) {
    const error = new Error("AI Try-On history not found");
    error.statusCode = 404;
    throw error;
  }

  const roleName = user.role && user.role.name;
  if (history.userId !== user.id && roleName !== "ADMIN") {
    const error = new Error("Forbidden");
    error.statusCode = 403;
    throw error;
  }

  await aiTryOnRepository.remove(id);
  return null;
};

module.exports = {
  create,
  getByUser,
  getById,
  remove,
};
