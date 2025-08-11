import { User } from "../models/association.js";
import { notFound } from "../utils/error.js";

const userService = {
  getAllUsers: async () => {
    const users = await User.findAll();
    return users;
  },

  getUserById: async (userId) => {
    const user = await User.findByPk(userId);
    if (!user) {
      notFound(`User with id ${userId} not found`);
    }
    return user;
  },

  createUser: async (userData) => {
    const user = await User.create(userData);
    return user;
  },

  updateUser: async (userId, userData) => {
    const user = await User.findByPk(userId);
    if (!user) {
      notFound(`User with id ${userId} not found`);
    }
    await user.update(userData);
    return user;
  },
  
  deleteUser: async (userId) => {
    const user = await User.findByPk(userId);
    if (!user) {
      notFound(`User with id ${userId} not found`);
    }
    await user.destroy();
    return user;
  },
};

export default userService;