const fs = require("fs");
const path = require("path");
const AIProvider = require("./aiProvider");

const DEFAULT_MOCK_IMAGE = "/uploads/mock/mock-result.jpg";
const UPLOADS_MOCK_DIR = path.join(process.cwd(), "uploads", "mock");

const ensureMockUploadDir = () => {
  if (!fs.existsSync(UPLOADS_MOCK_DIR)) {
    fs.mkdirSync(UPLOADS_MOCK_DIR, { recursive: true });
  }
};

class MockProvider extends AIProvider {
  constructor() {
    super();
    ensureMockUploadDir();
  }

  sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  getGeneratedImageUrl() {
    return process.env.MOCK_AI_IMAGE || DEFAULT_MOCK_IMAGE;
  }

  async generateTryOn(options) {
    console.log("[AI Try-On] MockProvider.generateTryOn started", options);
    const delayMs = 3000 + Math.floor(Math.random() * 2001);
    await this.sleep(delayMs);

    return {
      provider: "mock",
      status: "SUCCESS",
      generatedImage: this.getGeneratedImageUrl(),
    };
  }
}

module.exports = MockProvider;
