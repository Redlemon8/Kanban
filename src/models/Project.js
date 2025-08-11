import { Model, DataTypes } from 'sequelize';
import { sequelize } from './connection.js';

export class Project extends Model {}

Project.init(
  {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [3, 100],
      },
    },
  },
  {
    sequelize,
    tableName: 'project',
  }
);

export default Project;