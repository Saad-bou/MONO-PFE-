const fs = require("fs");
const path = require("path");
const axios = require("axios");
const AIProvider = require("./aiProvider");

const BASE_URL = "https://api.fashn.ai/v1";
const POLL_INTERVAL_MS = 3000;
const POLL_TIMEOUT_MS = 120000;
const PENDING_STATUSES = new Set(["starting", "in_queue", "processing"]);

const MIME_TYPES = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
};

class FashnProvider extends AIProvider {
  constructor() {
    super();
    this.apiKey = process.env.FASHN_API_KEY;
    this.model = process.env.FASHN_MODEL || "tryon-v1.6";
  }

  getHeaders() {
    if (!this.apiKey) {
      throw new Error("FASHN API key is not configured");
    }

    return {
      Authorization: `Bearer ${this.apiKey}`,
      "Content-Type": "application/json",
    };
  }

  sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  resolveLocalPath(imagePath) {
    const normalized = imagePath.startsWith("/") ? imagePath.slice(1) : imagePath;
    const absolutePath = path.join(process.cwd(), normalized);

    if (!fs.existsSync(absolutePath)) {
      throw new Error("Image file not found");
    }

    return absolutePath;
  }

  toBase64DataUri(imagePath) {
    const absolutePath = this.resolveLocalPath(imagePath);
    const extension = path.extname(absolutePath).toLowerCase();
    const mimeType = MIME_TYPES[extension];

    if (!mimeType) {
      throw new Error("Unsupported image format");
    }

    const base64 = fs.readFileSync(absolutePath).toString("base64");
    return `data:${mimeType};base64,${base64}`;
  }

  prepareImageInput(imagePath) {
    if (typeof imagePath !== "string" || imagePath.trim().length === 0) {
      throw new Error("Image path is required");
    }

    const trimmed = imagePath.trim();

    if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
      return trimmed;
    }

    return this.toBase64DataUri(trimmed);
  }

  async startPrediction(personImage, garmentImage) {
    try {
      const response = await axios.post(
        `${BASE_URL}/run`,
        {
          model_name: this.model,
          inputs: {
            model_image: this.prepareImageInput(personImage),
            garment_image: this.prepareImageInput(garmentImage),
          },
        },
        {
          headers: this.getHeaders(),
        }
      );

      if (response.data.error || !response.data.id) {
        throw new Error("Failed to start try-on generation");
      }

      return response.data.id;
    } catch (error) {
      if (error.message === "FASHN API key is not configured") {
        throw error;
      }

      if (
        error.message === "Image file not found" ||
        error.message === "Unsupported image format" ||
        error.message === "Image path is required"
      ) {
        throw error;
      }

      throw new Error("Failed to start try-on generation");
    }
  }

  async pollPrediction(predictionId) {
    const startedAt = Date.now();

    while (Date.now() - startedAt < POLL_TIMEOUT_MS) {
      let statusData;

      try {
        const response = await axios.get(`${BASE_URL}/status/${predictionId}`, {
          headers: this.getHeaders(),
        });
        statusData = response.data;
      } catch (error) {
        if (error.message === "FASHN API key is not configured") {
          throw error;
        }

        throw new Error("Failed to retrieve try-on generation status");
      }

      const { status } = statusData;

      if (status === "completed") {
        const output = statusData.output;

        if (!Array.isArray(output) || output.length === 0 || !output[0]) {
          throw new Error("Try-on generation completed without output");
        }

        return output[0];
      }

      if (status === "failed") {
        throw new Error("Try-on generation failed");
      }

      if (PENDING_STATUSES.has(status)) {
        await this.sleep(POLL_INTERVAL_MS);
        continue;
      }

      throw new Error("Try-on generation failed");
    }

    throw new Error("Try-on generation timed out");
  }

  async generateTryOn(options) {
    const { personImage, garmentImage } = options;
    console.log("[AI Try-On] FashnProvider.generateTryOn started", {
      personImage,
      garmentImage,
      hasApiKey: Boolean(this.apiKey),
    });

    if (!personImage || !garmentImage) {
      throw new Error("Person and garment images are required");
    }

    const predictionId = await this.startPrediction(personImage, garmentImage);
    const generatedImage = await this.pollPrediction(predictionId);

    return {
      provider: "fashn",
      status: "SUCCESS",
      generatedImage,
    };
  }
}

module.exports = FashnProvider;
