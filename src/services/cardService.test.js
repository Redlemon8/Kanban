import { Card, List, Tag } from "../models/association.test.js";
import { notFound } from "../utils/error.js";

const cardService = {
  async getAllCards() {
    const cards = await Card.findAll({
      include: [
        {
          association: "tags",
        },
        {
          association: "list",
        },
      ],
      order: [["position", "ASC"]],
    });

    if (cards.length === 0) {
      throw new Error("Aucune carte trouvée");
    }

    return cards;
  },

  async getCardById(id) {
    const card = await Card.findByPk(id, {
      include: [
        {
          association: "tags",
        },
        {
          association: "list",
        },
      ],
    });

    if (!card) {
      notFound(`Carte avec l'ID ${id} non trouvée`);
    }

    return card;
  },

  async createCard(cardData) {
    const newCard = await Card.create(cardData);
    return newCard;
  },

  async updateCard(id, cardData) {
    const card = await Card.findByPk(id);
    if (!card) {
      notFound(`Carte avec l'ID ${id} non trouvée`);
    }

    await Card.update(cardData, { where: { id } });
    return await this.getCardById(id);
  },

  async deleteCard(id) {
    const card = await Card.findByPk(id);
    if (!card) {
      notFound(`Carte avec l'ID ${id} non trouvée`);
    }

    await Card.destroy({ where: { id } });
  },

  async getCardsByListId(listId) {
    const cards = await Card.findAll({
      where: { list_id: listId },
      include: [
        {
          association: "tags",
        },
        {
          association: "list",
        },
      ],
      order: [["position", "ASC"]],
    });

    if (cards.length === 0) {
      throw new Error("Aucune carte trouvée");
    }

    return cards;
  },
};

export default cardService; 