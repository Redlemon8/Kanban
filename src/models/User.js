import { Model, DataTypes } from 'sequelize';
import { sequelize } from './connection.js';
import argon2 from 'argon2';
import jwt from 'jsonwebtoken';

export class User extends Model {}

User.init(
  {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [3, 100],
      },
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [8, 100],
      },
    },
  },
  {
    sequelize,
    tableName: 'user',
  }
);

User.beforeCreate(async (user) => {
  user.password = await argon2.hash(user.password);
  return user;
});

User.beforeUpdate(async (user, options) => {
  if (user.changed('password')) {
    user.password = await argon2.hash(user.password);
  }
  return user;
});

User.prototype.validatePassword = async function(password) {
  return await argon2.verify(this.password, password);
};

User.prototype.generateAccessToken = function() {
  return jwt.sign(
    { 
      id: this.id,
      email: this.email,
      name: this.name
    },
    process.env.JWT_SECRET || 'your-secret-key',
    { expiresIn: '15m' }
  );
};

User.prototype.generateToken = function() {
  return this.generateAccessToken();
};

export default User;