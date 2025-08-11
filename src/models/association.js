import { sequelize } from './connection.js';
import { Card } from './Card.js';
import { List } from './List.js';
import { Tag } from './Tag.js';
import { Project } from './Project.js';
import { User } from './User.js';
import { RefreshToken } from './RefreshToken.js';

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

Project.hasMany(List, {
    as: "lists",
    foreignKey: "project_id"
});

List.belongsTo(Project, {
    as: "project",
    foreignKey: "project_id"
});

User.belongsToMany(Project, {
    as: "projects",
    through: "user_has_project",
    foreignKey: "user_id",
    otherKey: "project_id"
});

Project.belongsToMany(User, {
    as: "users",
    through: "user_has_project",
    foreignKey: "project_id",
    otherKey: "user_id"
});

User.hasMany(RefreshToken, {
    as: "refreshTokens",
    foreignKey: "userId"
});

RefreshToken.belongsTo(User, {
    as: "user",
    foreignKey: "userId"
});

export { List, Card, Tag, Project, User, RefreshToken, sequelize };