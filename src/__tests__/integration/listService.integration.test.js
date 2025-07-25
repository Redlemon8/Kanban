import { 
  initializeTestDatabase, 
  clearTestDatabase, 
  closeTestDatabase, 
  createTestData 
} from '../testUtils.js';

// Import du service après l'initialisation de la base de test
let listService;

describe("List Service Integration Tests", () => {
  beforeAll(async () => {
    // Initialiser la base de données de test
    await initializeTestDatabase();
    
    // Importer le service de test après l'initialisation
    const { Card, List, Tag } = await import('../../config/association.test.js');
    
    // Créer un service de test qui utilise les modèles SQLite
    listService = {
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
          throw new Error(`Liste avec l'ID ${listId} non trouvée`);
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
          throw new Error(`Liste avec l'ID ${listId} non trouvée`);
        }
        await list.update(listData);
        return await this.getListById(listId);
      },

      async deleteList(listId) {
        const list = await List.findByPk(listId);
        if (!list) {
          throw new Error(`Liste avec l'ID ${listId} non trouvée`);
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
  });

  afterAll(async () => {
    // Fermer la connexion de test
    await closeTestDatabase();
  });

  beforeEach(async () => {
    // Nettoyer la base de données avant chaque test
    await clearTestDatabase();
  });

  describe("getAllLists", () => {
    it("should return all lists with cards and tags", async () => {
      // Créer des données de test
      const testData = await createTestData();

      // Appeler le service
      const lists = await listService.getAllLists();

      // Vérifications
      expect(lists).toHaveLength(2);
      expect(lists[0].title).toBe('Liste Test 1');
      expect(lists[1].title).toBe('Liste Test 2');
      expect(lists[0].cards).toBeDefined();
      expect(lists[0].cards).toHaveLength(2);
      expect(lists[0].cards[0].tags).toBeDefined();
    });

    it("should return empty array when no lists exist", async () => {
      // Pas de données créées, la base est vide

      // Appeler le service
      const lists = await listService.getAllLists();

      // Vérifications
      expect(lists).toHaveLength(0);
    });
  });

  describe("getListById", () => {
    it("should return a list by id with cards and tags", async () => {
      // Créer des données de test
      const testData = await createTestData();
      const listId = testData.lists[0].id;

      // Appeler le service
      const list = await listService.getListById(listId);

      // Vérifications
      expect(list).toBeDefined();
      expect(list.id).toBe(listId);
      expect(list.title).toBe('Liste Test 1');
      expect(list.cards).toBeDefined();
      expect(list.cards).toHaveLength(2);
      expect(list.cards[0].tags).toBeDefined();
    });

    it("should throw error when list not found", async () => {
      // Pas de données créées

      // Appeler le service avec un ID inexistant
      await expect(listService.getListById(999)).rejects.toThrow("Liste avec l'ID 999 non trouvée");
    });
  });

  describe("createList", () => {
    it("should create a new list", async () => {
      const listData = {
        title: 'Nouvelle Liste',
        position: 3
      };

      // Appeler le service
      const newList = await listService.createList(listData);

      // Vérifications
      expect(newList).toBeDefined();
      expect(newList.title).toBe('Nouvelle Liste');
      expect(newList.position).toBe(3);
    });
  });

  describe("updateList", () => {
    it("should update a list", async () => {
      // Créer des données de test
      const testData = await createTestData();
      const listId = testData.lists[0].id;

      const updateData = {
        title: 'Liste Modifiée',
        position: 5
      };

      // Appeler le service
      const updatedList = await listService.updateList(listId, updateData);

      // Vérifications
      expect(updatedList).toBeDefined();
      expect(updatedList.title).toBe('Liste Modifiée');
      expect(updatedList.position).toBe(5);
      expect(updatedList.cards).toBeDefined();
    });

    it("should throw error when list not found", async () => {
      // Pas de données créées

      const updateData = {
        title: 'Liste Modifiée'
      };

      // Appeler le service avec un ID inexistant
      await expect(listService.updateList(999, updateData)).rejects.toThrow("Liste avec l'ID 999 non trouvée");
    });
  });

  describe("deleteList", () => {
    it("should delete a list", async () => {
      // Créer des données de test
      const testData = await createTestData();
      const listId = testData.lists[0].id;

      // Appeler le service
      await listService.deleteList(listId);

      // Vérifier que la liste a été supprimée
      await expect(listService.getListById(listId)).rejects.toThrow("Liste avec l'ID " + listId + " non trouvée");
    });

    it("should throw error when list not found", async () => {
      // Pas de données créées

      // Appeler le service avec un ID inexistant
      await expect(listService.deleteList(999)).rejects.toThrow("Liste avec l'ID 999 non trouvée");
    });
  });

  describe("getCardsByListId", () => {
    it("should return cards by list id", async () => {
      // Créer des données de test
      const testData = await createTestData();
      const listId = testData.lists[0].id;

      // Appeler le service
      const cards = await listService.getCardsByListId(listId);

      // Vérifications
      expect(cards).toHaveLength(2);
      expect(cards[0].list_id).toBe(listId);
      expect(cards[1].list_id).toBe(listId);
      expect(cards[0].tags).toBeDefined();
    });

    it("should throw error when no cards in list", async () => {
      // Créer seulement une liste sans cartes
      const { List } = await import('../../config/association.test.js');
      const list = await List.create({
        title: 'Liste Vide',
        position: 1
      });

      // Appeler le service et vérifier qu'il lance une erreur
      await expect(listService.getCardsByListId(list.id)).rejects.toThrow("Pas de carte dans la liste avec l'ID " + list.id);
    });
  });
}); 