import { sequelize } from './connection.js';
import { Card } from './Card.js';
import { List } from './List.js';
import { Tag } from './Tag.js';

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

export { List, Card, Tag, sequelize };