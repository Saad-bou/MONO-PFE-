const AIProvider = require("./aiProvider");

class HuggingFaceProvider extends AIProvider {
  async generateTryOn(options) {
    return {
      provider: "huggingface",
      status: "NOT_IMPLEMENTED",
    };
  }
}

module.exports = HuggingFaceProvider;
