import userService from "../services/userService.js";
import authService from "../services/authService.js";
import { createUserSchema, updateUserSchema } from "../schemas/userSchema.js";
import { Project } from "../models/association.js";
import User from "../models/User.js";

const userController = {
  findAll: async (req, res) => {
    const users = await userService.getAllUsers({
      attributes: {
        exclude: ["password"],
      },
      include: [
        {
          model: Project,
          as: "projects",
          attributes: ["id", "name"],
        },
      ],
    });
    res.json(users);
  },

  findOne: async (req, res) => {
    const user = await userService.getUserById(req.params.id, {
      attributes: {
        exclude: ["password"],
      },
      include: [
        {
          model: Project,
          as: "projects",
          attributes: ["id", "name"],
          through: {
            attributes: [],
          },
        },
      ],
      attributes: {
        exclude: ["password"],
      },
    });
    res.json(user);
  },

  create: async (req, res) => {
    const userData = req.body;

    const { error } = createUserSchema.validate(userData);
    if (error) {
      return res.status(400).json({ error: error.message });
    }

    const user = await userService.createUser(userData);
    res.status(201).json(user);
  },

  update: async (req, res) => {
    const userData = req.body;

    const { error } = updateUserSchema.validate(userData);
    if (error) {
      return res.status(400).json({ error: error.message });
    }

    const user = await userService.updateUser(req.params.id, userData);
    res.json(user);
  },
  
  delete: async (req, res) => {
    await userService.deleteUser(req.params.id);
    res.status(204).send();
  },

  register: async (req, res) => {
    const { name, email, password } = req.body;

    const { error } = createUserSchema.validate({ name, email, password });
    if (error) {
      return res.status(400).json({ error: error.message });
    }

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(409).json({ error: 'Email already exists' });
    }

    const user = await userService.createUser({ name, email, password });
    const tokens = await authService.generateTokens(user);

    res.status(201).json({
      message: 'User registered successfully',
      user: {
        id: user.id,
        name: user.name,
        email: user.email
      },
      ...tokens
    });
  },

  login: async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const isValidPassword = await user.validatePassword(password);
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const tokens = await authService.generateTokens(user);

    res.json({
      message: 'Login successful',
      user: {
        id: user.id,
        name: user.name,
        email: user.email
      },
      ...tokens
    });
  },

  refreshToken: async (req, res) => {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(400).json({ error: 'Refresh token is required' });
    }

    try {
      const tokens = await authService.refreshAccessToken(refreshToken);
      res.json({
        message: 'Token refreshed successfully',
        ...tokens
      });
    } catch (error) {
      return res.status(401).json({ error: error.message });
    }
  },

  logout: async (req, res) => {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(400).json({ error: 'Refresh token is required' });
    }

    try {
      await authService.revokeRefreshToken(refreshToken);
      res.json({ message: 'Logged out successfully' });
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  },

  logoutAll: async (req, res) => {
    try {
      await authService.revokeAllUserTokens(req.user.id);
      res.json({ message: 'Logged out from all devices successfully' });
    } catch (error) {
      return res.status(500).json({ error: 'Internal server error' });
    }
  },
};

export default userController;