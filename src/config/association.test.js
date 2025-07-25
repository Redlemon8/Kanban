import { testSequelize } from './database.test.js';
import { Model, DataTypes } from 'sequelize';

// Modèle List pour les tests
export class List extends Model {}
List.init(
  {
    title: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    position: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
    },
  },
  {
    sequelize: testSequelize,
    tableName: 'list',
  }
);

// Modèle Tag pour les tests
export class Tag extends Model {}
Tag.init(
  {
    name: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    color: {
      type: DataTypes.TEXT,
      defaultValue: '#000000',
    },
  },
  {
    sequelize: testSequelize,
    tableName: 'tag',
  }
);

// Modèle Card pour les tests
export class Card extends Model {}
Card.init(
  {
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    position: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
    },
    color: {
      type: DataTypes.TEXT,
      defaultValue: '#ffffff',
    },
    list_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    sequelize: testSequelize,
    tableName: 'card',
  }
);

// Définir les associations
List.hasMany(Card, {
  as: 'cards',
  foreignKey: "list_id"
});

Card.belongsTo(List, {
  as: "list",
  foreignKey: "list_id"
});

Card.belongsToMany(Tag, {
  as: "tags",
  through: "card_has_tag",
  foreignKey: "card_id",
  otherKey: "tag_id"
});

Tag.belongsToMany(Card, {
  as: "cards",
  through: "card_has_tag",
  foreignKey: "tag_id",
  otherKey: "card_id"
});

export { testSequelize }; 