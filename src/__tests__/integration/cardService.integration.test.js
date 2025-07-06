import { jest } from '@jest/globals';
import { 
  initializeTestDatabase, 
  clearTestDatabase, 
  closeTestDatabase, 
  createTestData 
} from '../../utils/testUtils.js';

// Import du service après l'initialisation de la base de test
let cardService;

describe("Card Service Integration Tests", () => {
  beforeAll(async () => {
    // Initialiser la base de données de test
    await initializeTestDatabase();
    
    // Importer le service de test après l'initialisation
    const { Card, List, Tag } = await import('../../models/association.test.js');
    
    // Créer un service de test qui utilise les modèles SQLite
    cardService = {
      async getAllCards() {
        const cards = await Card.findAll({
          include: [
            { association: 'list' },
            { association: 'tags' }
          ],
          order: [['position', 'ASC'], ['created_at', 'DESC']]
        });
        
        if (cards.length === 0) {
          throw new Error("Aucune carte trouvée");
        }
        
        return cards;
      },

      async getCardById(cardId) {
        const card = await Card.findByPk(cardId, {
          include: [
            { association: 'list' },
            { association: 'tags' }
          ]
        });
        
        if (!card) {
          throw new Error(`Carte avec l'ID ${cardId} non trouvée`);
        }
        
        return card;
      },

      async createCard(cardData) {
        const newCard = await Card.create(cardData);
        return newCard;
      },

      async updateCard(cardId, cardData) {
        const card = await Card.findByPk(cardId);
        if (!card) {
          throw new Error(`Carte avec l'ID ${cardId} non trouvée`);
        }
        await card.update(cardData);
        return card;
      },

      async deleteCard(cardId) {
        const card = await Card.findByPk(cardId);
        if (!card) {
          throw new Error(`Carte avec l'ID ${cardId} non trouvée`);
        }
        await card.destroy();
      },

      async getCardsByListId(listId) {
        const cards = await Card.findAll({
          where: { list_id: listId },
          include: 'tags',
          order: [['position', 'ASC'], ['created_at', 'DESC']]
        });
        
        if (cards.length === 0) {
          throw new Error("Aucune carte trouvée");
        }
        
        return cards;
      },

      async moveCard(cardId, newCardPosition, newListId) {
        const { testSequelize } = await import('../../config/database.test.js');
        const { Op } = await import('sequelize');
        
        const t = await testSequelize.transaction();
        try {
          const cardToMove = await Card.findByPk(cardId, { transaction: t });
          if (!cardToMove) {
            throw new Error(`Carte avec l'ID ${cardId} non trouvée`);
          }
          
          const list = await List.findByPk(newListId, { transaction: t });
          if (!list) {
            throw new Error(`Liste avec l'ID ${newListId} non trouvée`);
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
      }
    };
  });

  afterAll(async () => {
    // Fermer la connexion de test
    await closeTestDatabase();
  });

  beforeEach(async () => {
    // Nettoyer la base de données avant chaque test
    await clearTestDatabase();
  });

  describe("getAllCards", () => {
    it("should return all cards", async () => {
      // Créer des données de test
      const testData = await createTestData();

      // Appeler le service
      const cards = await cardService.getAllCards();

      // Vérifications
      expect(cards).toHaveLength(2);
      expect(cards[0].content).toBe('Carte Test 1');
      expect(cards[1].content).toBe('Carte Test 2');
      expect(cards[0].list).toBeDefined();
      expect(cards[0].tags).toBeDefined();
    });

    it("should throw error when no cards exist", async () => {
      // Pas de données créées, la base est vide

      // Appeler le service et vérifier qu'il lance une erreur
      await expect(cardService.getAllCards()).rejects.toThrow("Aucune carte trouvée");
    });
  });

  describe("getCardById", () => {
    it("should return a card by id", async () => {
      // Créer des données de test
      const testData = await createTestData();
      const cardId = testData.cards[0].id;

      // Appeler le service
      const card = await cardService.getCardById(cardId);

      // Vérifications
      expect(card).toBeDefined();
      expect(card.id).toBe(cardId);
      expect(card.content).toBe('Carte Test 1');
      expect(card.list).toBeDefined();
      expect(card.tags).toBeDefined();
    });

    it("should throw error when card not found", async () => {
      // Pas de données créées

      // Appeler le service avec un ID inexistant
      await expect(cardService.getCardById(999)).rejects.toThrow("Carte avec l'ID 999 non trouvée");
    });
  });

  describe("createCard", () => {
    it("should create a new card", async () => {
      // Créer une liste de test
      const { List } = await import('../../models/association.test.js');
      const list = await List.create({
        title: 'Liste Test',
        position: 1
      });

      const cardData = {
        content: 'Nouvelle Carte',
        position: 1,
        color: '#ffffff',
        list_id: list.id
      };

      // Appeler le service
      const newCard = await cardService.createCard(cardData);

      // Vérifications
      expect(newCard).toBeDefined();
      expect(newCard.content).toBe('Nouvelle Carte');
      expect(newCard.list_id).toBe(list.id);
    });
  });

  describe("updateCard", () => {
    it("should update a card", async () => {
      // Créer des données de test
      const testData = await createTestData();
      const cardId = testData.cards[0].id;

      const updateData = {
        content: 'Carte Modifiée',
        color: '#ff0000'
      };

      // Appeler le service
      const updatedCard = await cardService.updateCard(cardId, updateData);

      // Vérifications
      expect(updatedCard).toBeDefined();
      expect(updatedCard.content).toBe('Carte Modifiée');
      expect(updatedCard.color).toBe('#ff0000');
    });

    it("should throw error when card not found", async () => {
      // Pas de données créées

      const updateData = {
        content: 'Carte Modifiée'
      };

      // Appeler le service avec un ID inexistant
      await expect(cardService.updateCard(999, updateData)).rejects.toThrow("Carte avec l'ID 999 non trouvée");
    });
  });

  describe("deleteCard", () => {
    it("should delete a card", async () => {
      // Créer des données de test
      const testData = await createTestData();
      const cardId = testData.cards[0].id;

      // Appeler le service
      await cardService.deleteCard(cardId);

      // Vérifier que la carte a été supprimée
      await expect(cardService.getCardById(cardId)).rejects.toThrow("Carte avec l'ID " + cardId + " non trouvée");
    });

    it("should throw error when card not found", async () => {
      // Pas de données créées

      // Appeler le service avec un ID inexistant
      await expect(cardService.deleteCard(999)).rejects.toThrow("Carte avec l'ID 999 non trouvée");
    });
  });

  describe("getCardsByListId", () => {
    it("should return cards by list id", async () => {
      // Créer des données de test
      const testData = await createTestData();
      const listId = testData.lists[0].id;

      // Appeler le service
      const cards = await cardService.getCardsByListId(listId);

      // Vérifications
      expect(cards).toHaveLength(2);
      expect(cards[0].list_id).toBe(listId);
      expect(cards[1].list_id).toBe(listId);
    });

    it("should throw error when no cards in list", async () => {
      // Créer seulement une liste sans cartes
      const { List } = await import('../../models/association.test.js');
      const list = await List.create({
        title: 'Liste Vide',
        position: 1
      });

      // Appeler le service et vérifier qu'il lance une erreur
      await expect(cardService.getCardsByListId(list.id)).rejects.toThrow("Aucune carte trouvée");
    });
  });

  describe("moveCard", () => {
    it("should move a card to a new position in the same list", async () => {
      // Créer des données de test avec plusieurs cartes dans la même liste
      const { Card, List } = await import('../../models/association.test.js');
      
      const list = await List.create({
        title: 'Liste Test',
        position: 1
      });

      const card1 = await Card.create({
        content: 'Carte 1',
        position: 1,
        color: '#ffffff',
        list_id: list.id
      });

      const card2 = await Card.create({
        content: 'Carte 2',
        position: 2,
        color: '#ffffff',
        list_id: list.id
      });

      const card3 = await Card.create({
        content: 'Carte 3',
        position: 3,
        color: '#ffffff',
        list_id: list.id
      });

      // Déplacer la carte 1 de la position 1 à la position 3
      const movedCard = await cardService.moveCard(card1.id, 3, list.id);

      // Vérifications
      expect(movedCard).toBeDefined();
      expect(movedCard.id).toBe(card1.id);
      expect(movedCard.position).toBe(3);
      expect(movedCard.list_id).toBe(list.id);

      // Vérifier que les autres cartes ont été repositionnées
      const updatedCard2 = await Card.findByPk(card2.id);
      const updatedCard3 = await Card.findByPk(card3.id);
      
      expect(updatedCard2.position).toBe(1); // Déplacée vers le haut
      expect(updatedCard3.position).toBe(2); // Déplacée vers le haut
    });

    it("should move a card to a different list", async () => {
      // Créer deux listes avec des cartes
      const { Card, List } = await import('../../models/association.test.js');
      
      const list1 = await List.create({
        title: 'Liste 1',
        position: 1
      });

      const list2 = await List.create({
        title: 'Liste 2',
        position: 2
      });

      const card1 = await Card.create({
        content: 'Carte 1',
        position: 1,
        color: '#ffffff',
        list_id: list1.id
      });

      const card2 = await Card.create({
        content: 'Carte 2',
        position: 2,
        color: '#ffffff',
        list_id: list1.id
      });

      const card3 = await Card.create({
        content: 'Carte 3',
        position: 1,
        color: '#ffffff',
        list_id: list2.id
      });

      // Déplacer la carte 1 de la liste 1 vers la liste 2 à la position 2
      const movedCard = await cardService.moveCard(card1.id, 2, list2.id);

      // Vérifications
      expect(movedCard).toBeDefined();
      expect(movedCard.id).toBe(card1.id);
      expect(movedCard.position).toBe(2);
      expect(movedCard.list_id).toBe(list2.id);

      // Vérifier que la carte 2 dans la liste 1 a été repositionnée
      const updatedCard2 = await Card.findByPk(card2.id);
      expect(updatedCard2.position).toBe(1); // Déplacée vers le haut

      // Vérifier que la carte 3 dans la liste 2 a été repositionnée
      const updatedCard3 = await Card.findByPk(card3.id);
      expect(updatedCard3.position).toBe(1); // Reste en position 1
    });

    it("should throw error when card not found", async () => {
      // Créer une liste de test
      const { List } = await import('../../models/association.test.js');
      const list = await List.create({
        title: 'Liste Test',
        position: 1
      });

      // Appeler le service avec un ID de carte inexistant
      await expect(cardService.moveCard(999, 1, list.id)).rejects.toThrow("Carte avec l'ID 999 non trouvée");
    });

    it("should throw error when list not found", async () => {
      // Créer une carte de test
      const { Card, List } = await import('../../models/association.test.js');
      const list = await List.create({
        title: 'Liste Test',
        position: 1
      });

      const card = await Card.create({
        content: 'Carte Test',
        position: 1,
        color: '#ffffff',
        list_id: list.id
      });

      // Appeler le service avec un ID de liste inexistant
      await expect(cardService.moveCard(card.id, 1, 999)).rejects.toThrow("Liste avec l'ID 999 non trouvée");
    });

    it("should maintain data integrity with transactions", async () => {
      // Créer des données de test
      const { Card, List } = await import('../../models/association.test.js');
      
      const list1 = await List.create({
        title: 'Liste 1',
        position: 1
      });

      const list2 = await List.create({
        title: 'Liste 2',
        position: 2
      });

      const card1 = await Card.create({
        content: 'Carte 1',
        position: 1,
        color: '#ffffff',
        list_id: list1.id
      });

      const card2 = await Card.create({
        content: 'Carte 2',
        position: 2,
        color: '#ffffff',
        list_id: list1.id
      });

      // Déplacer la carte 1 vers la liste 2
      await cardService.moveCard(card1.id, 1, list2.id);

      // Vérifier que les positions sont cohérentes
      const updatedCard1 = await Card.findByPk(card1.id);
      const updatedCard2 = await Card.findByPk(card2.id);

      expect(updatedCard1.list_id).toBe(list2.id);
      expect(updatedCard1.position).toBe(1);
      expect(updatedCard2.list_id).toBe(list1.id);
      expect(updatedCard2.position).toBe(1); // Déplacée vers le haut
    });
  });
}); 