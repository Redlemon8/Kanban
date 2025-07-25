//src/__tests__/unit/cardService.unit.js
// Service pour les tests unitaires - utilise des mocks
import { notFound } from '../../utils/error.js';

// Ces mocks seront définis dans les tests
let mockCard, mockList, mockTag, mockSequelize;

// Fonction pour injecter les mocks
export function setMocks(cardMock, listMock, tagMock, sequelizeMock) {
  mockCard = cardMock;
  mockList = listMock;
  mockTag = tagMock;
  mockSequelize = sequelizeMock;
}

const cardService = {
  async getAllCards() {
    const cards = await mockCard.findAll({
      include: { association: "tags", include: "list" },
      order: [["position", "ASC"]],
    });
    
    if (cards.length === 0) {
      throw new Error("Aucune carte trouvée");
    }
    
    return cards;
  },

  async getCardById(cardId) {
    const card = await mockCard.findByPk(cardId, {
      include: { association: "tags", include: "list" },
    });
    
    if (!card) {
      notFound(`Carte avec l'ID ${cardId} non trouvée`);
    }
    
    return card;
  },

  async createCard(cardData) {
    const newCard = await mockCard.create(cardData);
    return newCard;
  },

  async updateCard(cardId, cardData) {
    const card = await mockCard.findByPk(cardId);
    if (!card) {
      notFound(`Carte avec l'ID ${cardId} non trouvée`);
    }
    await mockCard.update(cardData, { where: { id: cardId } });
    return card;
  },

  async deleteCard(cardId) {
    const card = await mockCard.findByPk(cardId);
    if (!card) {
      notFound(`Carte avec l'ID ${cardId} non trouvée`);
    }
    await mockCard.destroy(cardId);
  },

  async moveCard(cardId, newCardPosition, newListId) {
    const t = await mockSequelize.transaction();
    try {
      const cardToMove = await mockCard.findByPk(cardId, { transaction: t });
      if (!cardToMove) {
        notFound(`Carte avec l'ID ${cardId} non trouvée`);
      }
      
      const list = await mockList.findByPk(newListId, { transaction: t });
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
          await mockCard.decrement('position', {
            where: {
              list_id: oldListId,
              id: { $ne: cardId },
              position: { $gt: oldPosition, $lte: newCardPosition },
            },
            by: 1,
            transaction: t,
          });
        } else if (oldPosition > newCardPosition) {
          // On monte : incrémenter les positions des cartes entre la nouvelle et l'ancienne position
          await mockCard.increment('position', {
            where: {
              list_id: oldListId,
              id: { $ne: cardId },
              position: { $gte: newCardPosition, $lt: oldPosition },
            },
            by: 1,
            transaction: t,
          });
        }
      } else {
        // Si on change de liste
        // Ajuster les positions dans l'ancienne liste (décrémenter celles après l'ancienne position)
        await mockCard.decrement('position', {
          where: {
            list_id: oldListId,
            position: { $gt: oldPosition },
          },
          by: 1,
          transaction: t,
        });

        // Ajuster les positions dans la nouvelle liste (incrémenter celles à partir de la nouvelle position)
        await mockCard.increment('position', {
          where: {
            list_id: newListId,
            id: { $ne: cardId },
            position: { $gte: newCardPosition },
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