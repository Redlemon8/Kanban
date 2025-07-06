//src/services/cardService.js
import { Card, List, Tag } from '../models/association.js';
import { sequelize } from '../models/connection.js';
import { Op } from 'sequelize';
import { notFound } from '../utils/error.js';

const cardService = {
  async getAllCards() {
    const cards = await Card.findAll({
      include: ["list", "tags"],
      order: [
        ["position", "ASC"],
        ["created_at", "DESC"],
      ],
    });
    return cards;
  },

  async getCardById(cardId) {
    const card = await Card.findByPk(cardId, {
      include: ["list", "tags"],
    });
    if (!card) {
      notFound(`Carte avec l'ID ${cardId} non trouvée`);
    }
    return card;
  },

  async createCard(cardData) {
    const newCard = await Card.create(cardData);
    return newCard;
  },

  async updateCard(cardId, cardData) {
    const card = await Card.findByPk(cardId, {
      include: ["list", "tags"],
    });
    if (!card) {
      notFound(`Carte avec l'ID ${cardId} non trouvée`);
    }
    await card.update(cardData);
    return card;
  },

  async deleteCard(cardId) {
    const card = await Card.findByPk(cardId, {
      include: ["list", "tags"],
    });
    if (!card) {
      notFound(`Carte avec l'ID ${cardId} non trouvée`);
    }
    await card.destroy();
  },

  async getCardsByListId(listId) {
    const cards = await Card.findAll({
      where: { list_id: listId },
      include: ["list", "tags"],
      order: [
        ["position", "ASC"],
        ["created_at", "DESC"],
      ],
    });
    if (!cards) {
      notFound(`Pas de carte dans la liste avec l'ID ${listId}`);
    }
    return cards;
  },

  async getCardsByTagId(tagId) {
    const cards = await Card.findAll({
      where: { tags: { [Op.contains]: [tagId] } },
      include: ["list", "tags"],
    });
    if (!cards) {
      notFound(`Pas de carte avec le tag ${tagId}`);
    }
    return cards;
  },

  async moveCard(cardId, newCardPosition, newListId) {
    const t = await sequelize.transaction();
    try {
      const cardToMove = await Card.findByPk(cardId, { transaction: t });
      if (!cardToMove) {
        notFound(`Carte avec l'ID ${cardId} non trouvée`);
      }
      
      const list = await List.findByPk(newListId, { transaction: t });
      if (!list) {
        notFound(`Liste avec l'ID ${newListId} non trouvée`);
      }

      const oldListId = cardToMove.list_id;
      const oldPosition = cardToMove.position;

      // Mettre à jour la carte
      cardToMove.list_id = newListId;
      cardToMove.position = newCardPosition;
      await cardToMove.save({ transaction: t });

      // Si on reste dans la même liste
      if (oldListId === newListId) {
        if (oldPosition < newCardPosition) {
          // On descend : décrémenter les positions des cartes entre l'ancienne et la nouvelle position
          await Card.decrement('position', {
            where: {
              list_id: oldListId,
              id: { [Op.ne]: cardId },
              position: { [Op.gt]: oldPosition, [Op.lte]: newCardPosition },
            },
            by: 1,
            transaction: t,
          });
        } else if (oldPosition > newCardPosition) {
          // On monte : incrémenter les positions des cartes entre la nouvelle et l'ancienne position
          await Card.increment('position', {
            where: {
              list_id: oldListId,
              id: { [Op.ne]: cardId },
              position: { [Op.gte]: newCardPosition, [Op.lt]: oldPosition },
            },
            by: 1,
            transaction: t,
          });
        }
      } else {
        // Si on change de liste
        // Ajuster les positions dans l'ancienne liste (décrémenter celles après l'ancienne position)
        await Card.decrement('position', {
          where: {
            list_id: oldListId,
            position: { [Op.gt]: oldPosition },
          },
          by: 1,
          transaction: t,
        });

        // Ajuster les positions dans la nouvelle liste (incrémenter celles à partir de la nouvelle position)
        await Card.increment('position', {
          where: {
            list_id: newListId,
            id: { [Op.ne]: cardId },
            position: { [Op.gte]: newCardPosition },
          },
          by: 1,
          transaction: t,
        });
      }

      await t.commit();
      return await cardToMove.reload({ include: ["list", "tags"] });
    } catch (error) {
      await t.rollback();
      throw error;
    }
  },
};

export default cardService;