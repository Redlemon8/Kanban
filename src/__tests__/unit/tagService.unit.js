// Service pour les tests unitaires - utilise des mocks
import { notFound } from '../../utils/error.js';

// Ces mocks seront définis dans les tests
let mockTag, mockCard;

// Fonction pour injecter les mocks
export function setMocks(tagMock, cardMock) {
  mockTag = tagMock;
  mockCard = cardMock;
}

const tagService = {
  async getAllTags() {
    const tags = await mockTag.findAll();
    return tags;
  },

  async getTagById(tagId) {
    const tag = await mockTag.findByPk(tagId);
    if (!tag) {
      notFound(`Tag avec l'ID ${tagId} non trouvé`);
    }
    return tag;
  },

  async createTag(tagData) {
    const newTag = await mockTag.create(tagData);
    return newTag;
  },

  async updateTag(tagId, tagData) {
    const tag = await mockTag.findByPk(tagId);
    if (!tag) {
      notFound(`Tag avec l'ID ${tagId} non trouvé`);
    }
    await tag.update(tagData);
    return tag;
  },

  async deleteTag(tagId) {
    const tag = await mockTag.findByPk(tagId);
    if (!tag) {
      notFound(`Tag avec l'ID ${tagId} non trouvé`);
    }
    await tag.destroy();
  },

  async linkTagToCard(tagId, cardId) {
    const tag = await mockTag.findByPk(tagId);
    const card = await mockCard.findByPk(cardId);
    if (!tag || !card) {
      notFound(`Tag avec l'ID ${tagId} ou carte avec l'ID ${cardId} non trouvé(s)`);
    }
    await tag.addCard(card);
    return tag;
  },

  async unlinkTagFromCard(tagId, cardId) {
    const tag = await mockTag.findByPk(tagId);
    const card = await mockCard.findByPk(cardId);
    if (!tag || !card) {
      notFound(`Tag avec l'ID ${tagId} ou carte avec l'ID ${cardId} non trouvé(s)`);
    }
    await tag.removeCard(card);
    return tag;
  },
};

export default tagService; 