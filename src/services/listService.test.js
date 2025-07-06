import { List, Card } from '../models/association.test.js';
import { notFound } from '../utils/error.js';

const listService = {
  async getAllLists() {
    const lists = await List.findAll({
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
    const list = await List.findByPk(listId, {
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
    const newList = await List.create(listData);
    return newList;
  },

  async updateList(listId, listData) {
    const list = await List.findByPk(listId);
    if (!list) {
      notFound(`Liste avec l'ID ${listId} non trouvée`);
    }
    await list.update(listData);
    return await this.getListById(listId);
  },

  async deleteList(listId) {
    const list = await List.findByPk(listId);
    if (!list) {
      notFound(`Liste avec l'ID ${listId} non trouvée`);
    }
    await list.destroy();
  },

  async getCardsByListId(listId) {
    const cards = await Card.findAll({
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