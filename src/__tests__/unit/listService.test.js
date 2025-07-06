import { jest } from '@jest/globals';
import listService, { setMocks } from './listService.unit.js';

// Mocks des modèles
const mockList = {
  findAll: jest.fn(),
  findByPk: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  destroy: jest.fn(),
};
const mockCard = {
  findAll: jest.fn(),
};

jest.mock('../../utils/error.js', () => ({
  notFound: jest.fn((message) => { throw new Error(message); }),
}));

describe('List Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Injecter les mocks dans le service
    setMocks(mockList, mockCard);
  });

  describe('getAllLists', () => {
    it('should return all lists', async () => {
      const mockLists = [{ id: 1, title: 'Liste 1' }, { id: 2, title: 'Liste 2' }];
      mockList.findAll.mockResolvedValue(mockLists);
      const lists = await listService.getAllLists();
      expect(lists).toEqual(mockLists);
      expect(mockList.findAll).toHaveBeenCalledTimes(1);
      expect(mockList.findAll).toHaveBeenCalledWith({
        include: [
          { association: 'cards', include: 'tags' }
        ],
      });
    });
  });

  describe('getListById', () => {
    it('should return a list by id', async () => {
      const mockListData = { id: 1, title: 'Liste 1' };
      mockList.findByPk.mockResolvedValue(mockListData);
      const list = await listService.getListById(1);
      expect(list).toEqual(mockListData);
      expect(mockList.findByPk).toHaveBeenCalledWith(1, {
        include: [
          { association: 'cards', include: 'tags' }
        ],
      });
    });
    it('should throw error if not found', async () => {
      mockList.findByPk.mockResolvedValue(null);
      await expect(listService.getListById(1)).rejects.toThrow('Liste avec l\'ID 1 non trouvée');
    });
  });

  describe('createList', () => {
    it('should create a new list', async () => {
      const data = { title: 'Nouvelle Liste', position: 1 };
      mockList.create.mockResolvedValue(data);
      const list = await listService.createList(data);
      expect(list).toEqual(data);
      expect(mockList.create).toHaveBeenCalledWith(data);
    });
  });

  describe('updateList', () => {
    it('should update a list', async () => {
      const data = { title: 'Modifiée', position: 2 };
      const mockListInstance = { update: jest.fn().mockResolvedValue(), id: 1 };
      mockList.findByPk.mockResolvedValue(mockListInstance);
      const getListByIdSpy = jest.spyOn(listService, 'getListById').mockResolvedValue({ id: 1, ...data });
      const updated = await listService.updateList(1, data);
      expect(getListByIdSpy).toHaveBeenCalledWith(1);
      expect(updated).toEqual({ id: 1, ...data });
      getListByIdSpy.mockRestore();
    });
    it('should throw error if not found', async () => {
      mockList.findByPk.mockResolvedValue(null);
      await expect(listService.updateList(1, {})).rejects.toThrow('Liste avec l\'ID 1 non trouvée');
    });
  });

  describe('deleteList', () => {
    it('should delete a list', async () => {
      const mockListInstance = { destroy: jest.fn().mockResolvedValue() };
      mockList.findByPk.mockResolvedValue(mockListInstance);
      await listService.deleteList(1);
      expect(mockList.findByPk).toHaveBeenCalledWith(1);
    });
    it('should throw error if not found', async () => {
      mockList.findByPk.mockResolvedValue(null);
      await expect(listService.deleteList(1)).rejects.toThrow('Liste avec l\'ID 1 non trouvée');
    });
  });

  describe('getCardsByListId', () => {
    it('should return cards by list id', async () => {
      const mockCards = [{ id: 1, list_id: 1 }, { id: 2, list_id: 1 }];
      mockCard.findAll.mockResolvedValue(mockCards);
      const cards = await listService.getCardsByListId(1);
      expect(cards).toEqual(mockCards);
      expect(mockCard.findAll).toHaveBeenCalledWith({ where: { list_id: 1 }, include: 'tags' });
    });
    it('should throw error if no cards', async () => {
      mockCard.findAll.mockResolvedValue([]);
      await expect(listService.getCardsByListId(1)).rejects.toThrow('Pas de carte dans la liste avec l\'ID 1');
    });
  });
}); 