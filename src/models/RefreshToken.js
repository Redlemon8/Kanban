import { Model, DataTypes } from 'sequelize';
import { sequelize } from './connection.js';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';

export class RefreshToken extends Model {}

RefreshToken.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    token: {
      type: DataTypes.TEXT,
      allowNull: false,
      unique: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'user',
        key: 'id',
      },
    },
    expiresAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    isRevoked: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  },
  {
    sequelize,
    tableName: 'refresh_token',
  }
);

RefreshToken.generateToken = function(userId) {
  const token = crypto.randomBytes(64).toString('hex');
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 30);

  return {
    token,
    userId,
    expiresAt,
  };
};

RefreshToken.prototype.isExpired = function() {
  return this.expiresAt < new Date() || this.isRevoked;
};

RefreshToken.prototype.revoke = async function() {
  this.isRevoked = true;
  await this.save();
};

export default RefreshToken;