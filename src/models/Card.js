import { Model, DataTypes } from 'sequelize';
import { sequelize } from './connection.js'

export class Card extends Model {}

Card.init(
  {
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        len: [3, 1000],
      },
    },
    position: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
    },
    color: {
      type: DataTypes.TEXT,
      defaultValue: '#ffffff',
      validate: {
        isHexColor: true,
      },
    },
    list_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
    {
      sequelize,
      tableName: 'card',
    }
);