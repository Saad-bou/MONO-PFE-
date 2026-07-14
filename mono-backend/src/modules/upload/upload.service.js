const buildUploadUrl = (folder, filename) => {
  return `/uploads/${folder}/${filename}`;
};

const uploadAvatar = (file) => {
  return {
    url: buildUploadUrl("avatars", file.filename),
  };
};

const uploadProduct = (file) => {
  return {
    url: buildUploadUrl("products", file.filename),
  };
};

const uploadTryOn = (file) => {
  return {
    url: buildUploadUrl("try-on", file.filename),
  };
};

module.exports = {
  uploadAvatar,
  uploadProduct,
  uploadTryOn,
};
