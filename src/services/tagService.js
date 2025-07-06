//src/services/tagService.js
import { Tag, Card } from '../models/association.js';
import { notFound } from '../utils/error.js';

const tagService = {
  async getAllTags() {
    const tags = await Tag.findAll();
    return tags;
  },

  async getTagById(tagId) {
    const tag = await Tag.findByPk(tagId);
    if (!tag) {
      notFound(`Tag avec l'ID ${tagId} non trouvé`);
    }
    return tag;
  },

  async createTag(tagData) {
    const newTag = await Tag.create(tagData);
    return newTag;
  },

  async updateTag(tagId, tagData) {
    const tag = await Tag.findByPk(tagId);
    if (!tag) {
      notFound(`Tag avec l'ID ${tagId} non trouvé`);
    }
    await tag.update(tagData);
    return tag;
  },

  async deleteTag(tagId) {
    const tag = await Tag.findByPk(tagId);
    if (!tag) {
      notFound(`Tag avec l'ID ${tagId} non trouvé`);
    }
    await tag.destroy();
  },

  // TODO: Check if this is used
  async getTagsByCardId(cardId) {
    const tags = await Tag.findAll({
      where: { cards: { [Op.contains]: [cardId] } },
    });
    return tags;
  },

  async linkTagToCard(tagId, cardId) {
    const tag = await Tag.findByPk(tagId);
    const card = await Card.findByPk(cardId);
    if (!tag || !card) {
      notFound(`Tag avec l'ID ${tagId} ou carte avec l'ID ${cardId} non trouvé(s)`);
    }
    await tag.addCard(card);
    return tag;
  },

  async unlinkTagFromCard(tagId, cardId) {
    const tag = await Tag.findByPk(tagId);
    const card = await Card.findByPk(cardId);
    if (!tag || !card) {
      notFound(`Tag avec l'ID ${tagId} ou carte avec l'ID ${cardId} non trouvé(s)`);
    }
    await tag.removeCard(card);
    return tag;
  },
};

export default tagService;