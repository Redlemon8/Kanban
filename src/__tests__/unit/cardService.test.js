import { jest } from '@jest/globals';
import cardService, { setMocks } from './cardService.unit.js';

// Mock des modèles
const mockCard = {
  findAll: jest.fn(),
  findByPk: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  destroy: jest.fn(),
  increment: jest.fn(),
  decrement: jest.fn(),
};

const mockList = {
  findByPk: jest.fn(),
};

const mockTag = {
  findByPk: jest.fn(),
};

// Mock de sequelize
const mockSequelize = {
  transaction: jest.fn(),
};

const mockTransaction = {
  commit: jest.fn(),
  rollback: jest.fn(),
};

// Mock des utilitaires d'erreur
const mockNotFound = jest.fn((message) => { throw new Error(message); });

jest.mock("../../utils/error.js", () => ({
  notFound: mockNotFound,
}));

describe("Card Service", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Injecter les mocks dans le service
    setMocks(mockCard, mockList, mockTag, mockSequelize);
    mockSequelize.transaction.mockResolvedValue(mockTransaction);
  });

  describe("getAllCards", () => {
    it("should return all cards", async () => {
      const mockCards = [{ id: 1, title: "Card 1" }, { id: 2, title: "Card 2" }];
      mockCard.findAll.mockResolvedValue(mockCards);

      const cards = await cardService.getAllCards();
      expect(cards).toEqual(mockCards);
      expect(mockCard.findAll).toHaveBeenCalledTimes(1);
      expect(mockCard.findAll).toHaveBeenCalledWith({
        include: { association: "tags", include: "list" },
        order: [["position", "ASC"]],
      });
    });

    test("should throw an error if no cards are found", async () => {
      mockCard.findAll.mockResolvedValue([]);

      await expect(cardService.getAllCards()).rejects.toThrow("Aucune carte trouvée");
      expect(mockCard.findAll).toHaveBeenCalledTimes(1);
    });
  });

  describe("getCardById", () => {
    it("should return a card by id", async () => {
      const mockCardData = { id: 1, title: "Card 1" };
      mockCard.findByPk.mockResolvedValue(mockCardData);

      const card = await cardService.getCardById(1);
      expect(card).toEqual(mockCardData);
      expect(mockCard.findByPk).toHaveBeenCalledTimes(1);
      expect(mockCard.findByPk).toHaveBeenCalledWith(1, {
        include: { association: "tags", include: "list" },
      });
    });

    test("should throw an error if no card is found", async () => {
      mockCard.findByPk.mockResolvedValue(null);

      await expect(cardService.getCardById(1)).rejects.toThrow("Carte avec l'ID 1 non trouvée");
      expect(mockCard.findByPk).toHaveBeenCalledTimes(1);
      expect(mockCard.findByPk).toHaveBeenCalledWith(1, {
        include: { association: "tags", include: "list" },
      });
    });
  });

  describe("createCard", () => {
    it("should create a new card", async () => {
      const mockCardData = { id: 1, title: "Card 1" };
      mockCard.create.mockResolvedValue(mockCardData);

      const card = await cardService.createCard(mockCardData);
      expect(card).toEqual(mockCardData);
      expect(mockCard.create).toHaveBeenCalledTimes(1);
      expect(mockCard.create).toHaveBeenCalledWith(mockCardData);
    });
  });

  describe("updateCard", () => {
    it("should update a card", async () => {
      const mockCardData = { id: 1, title: "Card 1" };
      mockCard.findByPk.mockResolvedValue(mockCardData);
      mockCard.update.mockResolvedValue(mockCardData);

      const card = await cardService.updateCard(1, mockCardData);
      expect(card).toEqual(mockCardData);
      expect(mockCard.update).toHaveBeenCalledTimes(1);
      expect(mockCard.update).toHaveBeenCalledWith(mockCardData, { where: { id: 1 } });
    });

    test("should throw an error if no card is found", async () => {
      mockCard.findByPk.mockResolvedValue(null);

      await expect(cardService.updateCard(1, {})).rejects.toThrow("Carte avec l'ID 1 non trouvée");
    });
  });

  describe("deleteCard", () => {
    it("should delete a card", async () => {
      const mockCardData = { id: 1, title: "Card 1" };
      mockCard.findByPk.mockResolvedValue(mockCardData);
      mockCard.destroy.mockResolvedValue(1);

      await cardService.deleteCard(1);
      expect(mockCard.destroy).toHaveBeenCalledTimes(1);
      expect(mockCard.destroy).toHaveBeenCalledWith(1);
    });

    test("should throw an error if no card is found", async () => {
      mockCard.findByPk.mockResolvedValue(null);

      await expect(cardService.deleteCard(1)).rejects.toThrow("Carte avec l'ID 1 non trouvée");
    });
  });

  describe("moveCard", () => {
    it("should move a card to a new position in the same list", async () => {
      const mockCardData = { 
        id: 1, 
        list_id: 1, 
        position: 2,
        save: jest.fn().mockResolvedValue(true),
        reload: jest.fn().mockResolvedValue({ id: 1, list_id: 1, position: 3 })
      };
      const mockListData = { id: 1, title: "List 1" };

      mockCard.findByPk.mockResolvedValue(mockCardData);
      mockList.findByPk.mockResolvedValue(mockListData);
      mockCard.decrement.mockResolvedValue();

      const result = await cardService.moveCard(1, 3, 1);

      expect(mockSequelize.transaction).toHaveBeenCalled();
      expect(mockCard.findByPk).toHaveBeenCalledWith(1, { transaction: mockTransaction });
      expect(mockList.findByPk).toHaveBeenCalledWith(1, { transaction: mockTransaction });
      expect(mockCardData.save).toHaveBeenCalledWith({ transaction: mockTransaction });
      expect(mockCard.decrement).toHaveBeenCalledWith('position', {
        where: {
          list_id: 1,
          id: { $ne: 1 },
          position: { $gt: 2, $lte: 3 },
        },
        by: 1,
        transaction: mockTransaction,
      });
      expect(mockTransaction.commit).toHaveBeenCalled();
      expect(mockCardData.reload).toHaveBeenCalledWith({ include: ["list", "tags"] });
    });

    it("should move a card to a different list", async () => {
      const mockCardData = { 
        id: 1, 
        list_id: 1, 
        position: 2,
        save: jest.fn().mockResolvedValue(true),
        reload: jest.fn().mockResolvedValue({ id: 1, list_id: 2, position: 1 })
      };
      const mockListData = { id: 2, title: "List 2" };

      mockCard.findByPk.mockResolvedValue(mockCardData);
      mockList.findByPk.mockResolvedValue(mockListData);
      mockCard.decrement.mockResolvedValue();
      mockCard.increment.mockResolvedValue();

      const result = await cardService.moveCard(1, 1, 2);

      expect(mockSequelize.transaction).toHaveBeenCalled();
      expect(mockCard.findByPk).toHaveBeenCalledWith(1, { transaction: mockTransaction });
      expect(mockList.findByPk).toHaveBeenCalledWith(2, { transaction: mockTransaction });
      expect(mockCardData.save).toHaveBeenCalledWith({ transaction: mockTransaction });
      
      // Vérifier l'ajustement dans l'ancienne liste
      expect(mockCard.decrement).toHaveBeenCalledWith('position', {
        where: {
          list_id: 1,
          position: { $gt: 2 },
        },
        by: 1,
        transaction: mockTransaction,
      });
      
      // Vérifier l'ajustement dans la nouvelle liste
      expect(mockCard.increment).toHaveBeenCalledWith('position', {
        where: {
          list_id: 2,
          id: { $ne: 1 },
          position: { $gte: 1 },
        },
        by: 1,
        transaction: mockTransaction,
      });
      
      expect(mockTransaction.commit).toHaveBeenCalled();
    });

    test("should throw an error if card not found", async () => {
      mockCard.findByPk.mockResolvedValue(null);

      await expect(cardService.moveCard(999, 1, 1)).rejects.toThrow("Carte avec l'ID 999 non trouvée");
      expect(mockTransaction.rollback).toHaveBeenCalled();
    });

    test("should throw an error if list not found", async () => {
      const mockCardData = { id: 1, list_id: 1, position: 2 };
      mockCard.findByPk.mockResolvedValue(mockCardData);
      mockList.findByPk.mockResolvedValue(null);

      await expect(cardService.moveCard(1, 1, 999)).rejects.toThrow("Liste avec l'ID 999 non trouvée");
      expect(mockTransaction.rollback).toHaveBeenCalled();
    });

    test("should rollback transaction on error", async () => {
      const mockCardData = { 
        id: 1, 
        list_id: 1, 
        position: 2,
        save: jest.fn().mockRejectedValue(new Error("Database error"))
      };
      const mockListData = { id: 1, title: "List 1" };

      mockCard.findByPk.mockResolvedValue(mockCardData);
      mockList.findByPk.mockResolvedValue(mockListData);

      await expect(cardService.moveCard(1, 1, 1)).rejects.toThrow("Database error");
      expect(mockTransaction.rollback).toHaveBeenCalled();
    });
  });
});
