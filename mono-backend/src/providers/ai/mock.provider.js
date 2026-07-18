const fs = require("fs");
const path = require("path");
const AIProvider = require("./aiProvider");

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

  async generateTryOn(options) {
    console.log("[AI Try-On] MockProvider.generateTryOn started", options);
    const delayMs = 3000 + Math.floor(Math.random() * 2001);
    await this.sleep(delayMs);

    return {
      provider: "mock",
      status: "SUCCESS",
      generatedImage: options.personImage,
    };
  }
}

module.exports = MockProvider;
