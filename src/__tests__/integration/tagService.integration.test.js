import { 
  initializeTestDatabase, 
  clearTestDatabase, 
  closeTestDatabase, 
  createTestData 
} from '../testUtils.js';

// Import du service après l'initialisation de la base de test
let tagService;

describe("Tag Service Integration Tests", () => {
  beforeAll(async () => {
    // Initialiser la base de données de test
    await initializeTestDatabase();
    
    // Importer le service de test après l'initialisation
    const { Card, List, Tag } = await import('../../config/association.test.js');
    
    // Créer un service de test qui utilise les modèles SQLite
    tagService = {
      async getAllTags() {
        const tags = await Tag.findAll();
        return tags;
      },

      async getTagById(tagId) {
        const tag = await Tag.findByPk(tagId);
        if (!tag) {
          throw new Error(`Tag avec l'ID ${tagId} non trouvé`);
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
          throw new Error(`Tag avec l'ID ${tagId} non trouvé`);
        }
        await tag.update(tagData);
        return tag;
      },

      async deleteTag(tagId) {
        const tag = await Tag.findByPk(tagId);
        if (!tag) {
          throw new Error(`Tag avec l'ID ${tagId} non trouvé`);
        }
        await tag.destroy();
      },

      async linkTagToCard(tagId, cardId) {
        const tag = await Tag.findByPk(tagId);
        const card = await Card.findByPk(cardId);
        if (!tag || !card) {
          throw new Error(`Tag avec l'ID ${tagId} ou carte avec l'ID ${cardId} non trouvé(s)`);
        }
        await tag.addCard(card);
        return tag;
      },

      async unlinkTagFromCard(tagId, cardId) {
        const tag = await Tag.findByPk(tagId);
        const card = await Card.findByPk(cardId);
        if (!tag || !card) {
          throw new Error(`Tag avec l'ID ${tagId} ou carte avec l'ID ${cardId} non trouvé(s)`);
        }
        await tag.removeCard(card);
        return tag;
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

  describe("getAllTags", () => {
    it("should return all tags", async () => {
      // Créer des données de test
      const testData = await createTestData();

      // Appeler le service
      const tags = await tagService.getAllTags();

      // Vérifications
      expect(tags).toHaveLength(2);
      expect(tags[0].name).toBe('Tag Test 1');
      expect(tags[1].name).toBe('Tag Test 2');
    });

    it("should return empty array when no tags exist", async () => {
      // Pas de données créées, la base est vide

      // Appeler le service
      const tags = await tagService.getAllTags();

      // Vérifications
      expect(tags).toHaveLength(0);
    });
  });

  describe("getTagById", () => {
    it("should return a tag by id", async () => {
      // Créer des données de test
      const testData = await createTestData();
      const tagId = testData.tags[0].id;

      // Appeler le service
      const tag = await tagService.getTagById(tagId);

      // Vérifications
      expect(tag).toBeDefined();
      expect(tag.id).toBe(tagId);
      expect(tag.name).toBe('Tag Test 1');
    });

    it("should throw error when tag not found", async () => {
      // Pas de données créées

      // Appeler le service avec un ID inexistant
      await expect(tagService.getTagById(999)).rejects.toThrow("Tag avec l'ID 999 non trouvé");
    });
  });

  describe("createTag", () => {
    it("should create a new tag", async () => {
      const tagData = {
        name: 'Nouveau Tag',
        color: '#0000ff'
      };

      // Appeler le service
      const newTag = await tagService.createTag(tagData);

      // Vérifications
      expect(newTag).toBeDefined();
      expect(newTag.name).toBe('Nouveau Tag');
      expect(newTag.color).toBe('#0000ff');
    });
  });

  describe("updateTag", () => {
    it("should update a tag", async () => {
      // Créer des données de test
      const testData = await createTestData();
      const tagId = testData.tags[0].id;

      const updateData = {
        name: 'Tag Modifié',
        color: '#ff00ff'
      };

      // Appeler le service
      const updatedTag = await tagService.updateTag(tagId, updateData);

      // Vérifications
      expect(updatedTag).toBeDefined();
      expect(updatedTag.name).toBe('Tag Modifié');
      expect(updatedTag.color).toBe('#ff00ff');
    });

    it("should throw error when tag not found", async () => {
      // Pas de données créées

      const updateData = {
        name: 'Tag Modifié'
      };

      // Appeler le service avec un ID inexistant
      await expect(tagService.updateTag(999, updateData)).rejects.toThrow("Tag avec l'ID 999 non trouvé");
    });
  });

  describe("deleteTag", () => {
    it("should delete a tag", async () => {
      // Créer des données de test
      const testData = await createTestData();
      const tagId = testData.tags[0].id;

      // Appeler le service
      await tagService.deleteTag(tagId);

      // Vérifier que le tag a été supprimé
      await expect(tagService.getTagById(tagId)).rejects.toThrow("Tag avec l'ID " + tagId + " non trouvé");
    });

    it("should throw error when tag not found", async () => {
      // Pas de données créées

      // Appeler le service avec un ID inexistant
      await expect(tagService.deleteTag(999)).rejects.toThrow("Tag avec l'ID 999 non trouvé");
    });
  });

  describe("linkTagToCard", () => {
    it("should link a tag to a card", async () => {
      // Créer des données de test
      const testData = await createTestData();
      const tagId = testData.tags[0].id;
      const cardId = testData.cards[0].id;

      // Appeler le service
      const result = await tagService.linkTagToCard(tagId, cardId);

      // Vérifications
      expect(result).toBeDefined();
      expect(result.id).toBe(tagId);
    });

    it("should throw error when tag not found", async () => {
      // Créer seulement une carte
      const { Card, List } = await import('../../config/association.test.js');
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

      // Appeler le service avec un tag inexistant
      await expect(tagService.linkTagToCard(999, card.id)).rejects.toThrow("Tag avec l'ID 999 ou carte avec l'ID " + card.id + " non trouvé(s)");
    });

    it("should throw error when card not found", async () => {
      // Créer seulement un tag
      const { Tag } = await import('../../config/association.test.js');
      const tag = await Tag.create({
        name: 'Tag Test',
        color: '#ff0000'
      });

      // Appeler le service avec une carte inexistante
      await expect(tagService.linkTagToCard(tag.id, 999)).rejects.toThrow("Tag avec l'ID " + tag.id + " ou carte avec l'ID 999 non trouvé(s)");
    });
  });

  describe("unlinkTagFromCard", () => {
    it("should unlink a tag from a card", async () => {
      // Créer des données de test
      const testData = await createTestData();
      const tagId = testData.tags[0].id;
      const cardId = testData.cards[0].id;

      // Appeler le service
      const result = await tagService.unlinkTagFromCard(tagId, cardId);

      // Vérifications
      expect(result).toBeDefined();
      expect(result.id).toBe(tagId);
    });

    it("should throw error when tag not found", async () => {
      // Créer seulement une carte
      const { Card, List } = await import('../../config/association.test.js');
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

      // Appeler le service avec un tag inexistant
      await expect(tagService.unlinkTagFromCard(999, card.id)).rejects.toThrow("Tag avec l'ID 999 ou carte avec l'ID " + card.id + " non trouvé(s)");
    });

    it("should throw error when card not found", async () => {
      // Créer seulement un tag
      const { Tag } = await import('../../config/association.test.js');
      const tag = await Tag.create({
        name: 'Tag Test',
        color: '#ff0000'
      });

      // Appeler le service avec une carte inexistante
      await expect(tagService.unlinkTagFromCard(tag.id, 999)).rejects.toThrow("Tag avec l'ID " + tag.id + " ou carte avec l'ID 999 non trouvé(s)");
    });
  });
}); 