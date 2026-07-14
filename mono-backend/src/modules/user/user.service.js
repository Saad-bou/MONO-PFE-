const userRepository = require("./user.repository");
const { hashPassword, comparePassword } = require("../../lib/bcrypt");

const getProfile = async (userId) => {
  const user = await userRepository.findById(userId);
  if (!user) {
    const error = new Error("User not found");
    error.statusCode = 404;
    throw error;
  }

  // Remove password from response just in case
  const { password, ...userWithoutPassword } = user;
  return userWithoutPassword;
};

const updateProfile = async (userId, payload) => {
  const { firstName, lastName, avatar } = payload;
  const updateData = {};

  if (firstName !== undefined) {
    updateData.firstName = firstName.trim();
  }
  if (lastName !== undefined) {
    updateData.lastName = lastName.trim();
  }
  if (avatar !== undefined) {
    updateData.avatar = avatar.trim();
  }

  const updatedUser = await userRepository.update(userId, updateData);
  return updatedUser;
};

const changePassword = async (userId, payload) => {
  const { currentPassword, newPassword } = payload;

  const user = await userRepository.findByIdWithPassword(userId);
  if (!user) {
    const error = new Error("User not found");
    error.statusCode = 404;
    throw error;
  }

  const isValidPassword = await comparePassword(currentPassword, user.password);
  if (!isValidPassword) {
    const error = new Error("Invalid current password");
    error.statusCode = 400;
    throw error;
  }

  const hashedPassword = await hashPassword(newPassword);
  await userRepository.updatePassword(userId, hashedPassword);

  return true;
};

module.exports = {
  getProfile,
  updateProfile,
  changePassword,
};
