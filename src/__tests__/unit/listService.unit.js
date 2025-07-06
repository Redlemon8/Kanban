// Service pour les tests unitaires - utilise des mocks
import { notFound } from '../../utils/error.js';

// Ces mocks seront définis dans les tests
let mockList, mockCard;

// Fonction pour injecter les mocks
export function setMocks(listMock, cardMock) {
  mockList = listMock;
  mockCard = cardMock;
}

const listService = {
  async getAllLists() {
    const lists = await mockList.findAll({
      include: [
        {
          association: "cards",
          include: "tags"
        }
      ],
    });
    return lists;
  },

  async getListById(listId) {
    const list = await mockList.findByPk(listId, {
      include: [
        {
          association: "cards",
          include: "tags"
        }
      ],
    });
    if (!list) {
      notFound(`Liste avec l'ID ${listId} non trouvée`);
    }
    return list;
  },

  async createList(listData) {
    const newList = await mockList.create(listData);
    return newList;
  },

  async updateList(listId, listData) {
    const list = await mockList.findByPk(listId);
    if (!list) {
      notFound(`Liste avec l'ID ${listId} non trouvée`);
    }
    await list.update(listData);
    return await this.getListById(listId);
  },

  async deleteList(listId) {
    const list = await mockList.findByPk(listId);
    if (!list) {
      notFound(`Liste avec l'ID ${listId} non trouvée`);
    }
    await list.destroy();
  },

  async getCardsByListId(listId) {
    const cards = await mockCard.findAll({
      where: { list_id: listId },
      include: "tags",
    });
    if (cards.length === 0) {
      throw new Error(`Pas de carte dans la liste avec l'ID ${listId}`);
    }
    return cards;
  }
};

export default listService; 