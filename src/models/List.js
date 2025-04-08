import { Model, DataTypes } from 'sequelize';
import { sequelize } from './connection.js';

export class List extends Model {}

List.init(
  {
    title: {
      type: DataTypes.TEXT,
      validate: {
        len: [3, 100]
      }
    },
    position: {
      type: DataTypes.INTEGER,
      defaultValue: 1,
    },
  },
  {
    sequelize,
    tableName: 'list',
  }
);
