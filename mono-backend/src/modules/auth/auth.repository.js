const prisma = require("../../lib/prisma");

const publicUserSelect = {
  id: true,
  firstName: true,
  lastName: true,
  email: true,
  isActive: true,
  role: {
    select: {
      id: true,
      name: true,
    },
  },
  createdAt: true,
  updatedAt: true,
};

const authUserSelect = {
  ...publicUserSelect,
  password: true,
};

const findRoleByName = (name) => {
  return prisma.role.findUnique({
    where: { name },
  });
};

const findUserByEmail = (email) => {
  return prisma.user.findUnique({
    where: { email },
    select: publicUserSelect,
  });
};

const findUserByEmailWithPassword = (email) => {
  return prisma.user.findUnique({
    where: { email },
    select: authUserSelect,
  });
};

const findUserById = (id) => {
  return prisma.user.findUnique({
    where: { id },
    select: publicUserSelect,
  });
};

const createUser = (data) => {
  return prisma.user.create({
    data,
    select: publicUserSelect,
  });
};

const authRepository = {
  findRoleByName,
  findUserByEmail,
  findUserByEmailWithPassword,
  findUserById,
  createUser,
};

module.exports = authRepository;
