const AIProvider = require("./aiProvider");

class ReplicateProvider extends AIProvider {
  async generateTryOn(options) {
    return {
      provider: "replicate",
      status: "NOT_IMPLEMENTED",
    };
  }
}

module.exports = ReplicateProvider;
