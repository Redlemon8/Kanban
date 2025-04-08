import { Model, DataTypes } from 'sequelize';
import { sequelize } from './connection.js';

class Tag extends Model {}

Tag.init(
  {
    name: {
      type: DataTypes.TEXT,
      allowNull: false,
      unique: true,
    },
    color: {
      type: DataTypes.TEXT,
      defaultValue: '#ffffff',
    },
  },
  {
    sequelize,
    tableName: 'tag',
  }
);

export { Tag };