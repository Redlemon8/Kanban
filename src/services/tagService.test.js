import { Tag, Card } from '../models/association.test.js';
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