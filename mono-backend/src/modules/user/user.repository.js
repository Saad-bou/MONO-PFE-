const prisma = require("../../lib/prisma");

const findById = async (id) => {
  return await prisma.user.findUnique({
    where: { id },
    include: {
      role: true,
    },
  });
};

const findByIdWithPassword = async (id) => {
  return await prisma.user.findUnique({
    where: { id },
  });
};

const update = async (id, data) => {
  return await prisma.user.update({
    where: { id },
    data,
    select: {
      id: true,
      firstName: true,
      lastName: true,
      email: true,
      avatar: true,
      isActive: true,
      lastLoginAt: true,
      roleId: true,
      role: true,
      createdAt: true,
      updatedAt: true,
    },
  });
};

const updatePassword = async (id, hashedPassword) => {
  return await prisma.user.update({
    where: { id },
    data: { password: hashedPassword },
  });
};

module.exports = {
  findById,
  findByIdWithPassword,
  update,
  updatePassword,
};
