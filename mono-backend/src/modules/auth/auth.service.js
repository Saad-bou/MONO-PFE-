const authRepository = require("./auth.repository");
const { hashPassword, comparePassword } = require("../../lib/bcrypt");
const { signToken } = require("../../lib/jwt");

const createError = (statusCode, message) => {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
};

const removePassword = (user) => {
  const { password, ...userWithoutPassword } = user;
  return userWithoutPassword;
};

const createAuthResponse = (user) => {
  const token = signToken({
    id: user.id,
    email: user.email,
    role: user.role.name,
  });

  return {
    token,
    user,
  };
};

const register = async ({ firstName, lastName, email, password }) => {
  const normalizedEmail = email.toLowerCase().trim();
  const trimmedFirstName = firstName.trim();
  const trimmedLastName = lastName.trim();
  const trimmedPassword = password.trim();

  const existingUser = await authRepository.findUserByEmail(normalizedEmail);

  if (existingUser) {
    throw createError(409, "Email already exists");
  }

  const customerRole = await authRepository.findRoleByName("CUSTOMER");

  if (!customerRole) {
    throw createError(500, "Default customer role is not configured");
  }

  const hashedPassword = await hashPassword(trimmedPassword);

  const user = await authRepository.createUser({
    firstName: trimmedFirstName,
    lastName: trimmedLastName,
    email: normalizedEmail,
    password: hashedPassword,
    roleId: customerRole.id,
  });

  return createAuthResponse(user);
};

const login = async ({ email, password }) => {
  const normalizedEmail = email.toLowerCase().trim();
  const trimmedPassword = password.trim();

  const user = await authRepository.findUserByEmailWithPassword(normalizedEmail);

  if (!user) {
    throw createError(401, "Invalid email or password");
  }

  const isPasswordValid = await comparePassword(trimmedPassword, user.password);

  if (!isPasswordValid) {
    throw createError(401, "Invalid email or password");
  }

  if (!user.isActive) {
    throw createError(403, "User account is inactive");
  }

  return createAuthResponse(removePassword(user));
};

const getMe = async (userId) => {
  const user = await authRepository.findUserById(userId);

  if (!user) {
    throw createError(404, "User not found");
  }

  return user;
};

module.exports = {
  register,
  login,
  getMe,
};
