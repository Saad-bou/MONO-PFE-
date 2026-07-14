const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const multer = require("multer");

const UPLOADS_ROOT = path.join(__dirname, "../../uploads");
const MAX_FILE_SIZE = 10 * 1024 * 1024;

const ALLOWED_MIME_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
]);

const MIME_EXTENSIONS = {
  "image/jpeg": ".jpg",
  "image/png": ".png",
  "image/webp": ".webp",
};

const ensureUploadDir = (subdir) => {
  const dirPath = path.join(UPLOADS_ROOT, subdir);

  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }

  return dirPath;
};

const generateFilename = (mimetype) => {
  const extension = MIME_EXTENSIONS[mimetype] || path.extname("");
  const random = crypto.randomBytes(3).toString("hex");

  return `${Date.now()}-${random}${extension}`;
};

const createStorage = (subdir) => {
  return multer.diskStorage({
    destination: (req, file, cb) => {
      try {
        const dirPath = ensureUploadDir(subdir);
        cb(null, dirPath);
      } catch (error) {
        cb(error);
      }
    },
    filename: (req, file, cb) => {
      cb(null, generateFilename(file.mimetype));
    },
  });
};

const fileFilter = (req, file, cb) => {
  if (!ALLOWED_MIME_TYPES.has(file.mimetype)) {
    const error = new Error("Invalid file type");
    error.statusCode = 400;
    return cb(error, false);
  }

  return cb(null, true);
};

const createUploader = (subdir) => {
  return multer({
    storage: createStorage(subdir),
    limits: {
      fileSize: MAX_FILE_SIZE,
    },
    fileFilter,
  }).single("file");
};

const handleUpload = (subdir) => {
  const uploader = createUploader(subdir);

  return (req, res, next) => {
    uploader(req, res, (error) => {
      if (error) {
        if (error instanceof multer.MulterError) {
          if (error.code === "LIMIT_FILE_SIZE") {
            error.statusCode = 400;
            error.message = "File size exceeds 10MB limit";
          } else {
            error.statusCode = 400;
          }
        }

        if (!error.statusCode) {
          error.statusCode = 400;
        }

        return next(error);
      }

      if (!req.file) {
        const missingFileError = new Error("File is required");
        missingFileError.statusCode = 400;
        return next(missingFileError);
      }

      return next();
    });
  };
};

ensureUploadDir("avatars");
ensureUploadDir("products");
ensureUploadDir("try-on");

module.exports = {
  handleUpload,
  uploadAvatar: handleUpload("avatars"),
  uploadProduct: handleUpload("products"),
  uploadTryOn: handleUpload("try-on"),
};
