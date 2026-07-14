const FashnProvider = require("./fashn.provider");
const HuggingFaceProvider = require("./huggingface.provider");
const ReplicateProvider = require("./replicate.provider");
const MockProvider = require("./mock.provider");

const createAIProvider = () => {
  const providerName = (process.env.AI_PROVIDER || "fashn").toLowerCase();
  console.log("[AI Try-On] createAIProvider:", {
    AI_PROVIDER: process.env.AI_PROVIDER,
    resolvedProvider: providerName,
  });

  switch (providerName) {
    case "fashn":
      return new FashnProvider();
    case "huggingface":
      return new HuggingFaceProvider();
    case "replicate":
      return new ReplicateProvider();
    case "mock":
      return new MockProvider();
    default:
      throw new Error("Unsupported AI provider");
  }
};

module.exports = {
  createAIProvider,
};
