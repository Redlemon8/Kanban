import { jest } from '@jest/globals';
import tagService, { setMocks } from './tagService.unit.js';

// Mocks des modèles
const mockTag = {
  findAll: jest.fn(),
  findByPk: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  destroy: jest.fn(),
  addCard: jest.fn(),
  removeCard: jest.fn(),
};
const mockCard = {
  findByPk: jest.fn(),
};

jest.mock('../../utils/error.js', () => ({
  notFound: jest.fn((message) => { throw new Error(message); }),
}));

describe('Tag Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Injecter les mocks dans le service
    setMocks(mockTag, mockCard);
  });

  describe('getAllTags', () => {
    it('should return all tags', async () => {
      const mockTags = [{ id: 1, name: 'Tag 1' }, { id: 2, name: 'Tag 2' }];
      mockTag.findAll.mockResolvedValue(mockTags);
      const tags = await tagService.getAllTags();
      expect(tags).toEqual(mockTags);
      expect(mockTag.findAll).toHaveBeenCalledTimes(1);
    });
  });

  describe('getTagById', () => {
    it('should return a tag by id', async () => {
      const mockTagData = { id: 1, name: 'Tag 1' };
      mockTag.findByPk.mockResolvedValue(mockTagData);
      const tag = await tagService.getTagById(1);
      expect(tag).toEqual(mockTagData);
      expect(mockTag.findByPk).toHaveBeenCalledWith(1);
    });
    it('should throw error if not found', async () => {
      mockTag.findByPk.mockResolvedValue(null);
      await expect(tagService.getTagById(1)).rejects.toThrow("Tag avec l'ID 1 non trouvé");
    });
  });

  describe('createTag', () => {
    it('should create a new tag', async () => {
      const data = { name: 'Nouveau Tag', color: '#fff' };
      mockTag.create.mockResolvedValue(data);
      const tag = await tagService.createTag(data);
      expect(tag).toEqual(data);
      expect(mockTag.create).toHaveBeenCalledWith(data);
    });
  });

  describe('updateTag', () => {
    it('should update a tag', async () => {
      const data = { name: 'Modifié', color: '#000' };
      const mockTagInstance = { update: jest.fn().mockResolvedValue(), id: 1 };
      mockTag.findByPk.mockResolvedValue(mockTagInstance);
      const updated = await tagService.updateTag(1, data);
      expect(updated).toBeDefined();
    });
    it('should throw error if not found', async () => {
      mockTag.findByPk.mockResolvedValue(null);
      await expect(tagService.updateTag(1, {})).rejects.toThrow("Tag avec l'ID 1 non trouvé");
    });
  });

  describe('deleteTag', () => {
    it('should delete a tag', async () => {
      const mockTagInstance = { destroy: jest.fn().mockResolvedValue() };
      mockTag.findByPk.mockResolvedValue(mockTagInstance);
      await tagService.deleteTag(1);
      expect(mockTag.findByPk).toHaveBeenCalledWith(1);
    });
    it('should throw error if not found', async () => {
      mockTag.findByPk.mockResolvedValue(null);
      await expect(tagService.deleteTag(1)).rejects.toThrow("Tag avec l'ID 1 non trouvé");
    });
  });

  describe('linkTagToCard', () => {
    it('should link a tag to a card', async () => {
      const mockTagInstance = { addCard: jest.fn().mockResolvedValue(), id: 1 };
      const mockCardInstance = { id: 2 };
      mockTag.findByPk.mockResolvedValue(mockTagInstance);
      mockCard.findByPk.mockResolvedValue(mockCardInstance);
      const result = await tagService.linkTagToCard(1, 2);
      expect(result).toBeDefined();
    });
    it('should throw error if tag or card not found', async () => {
      mockTag.findByPk.mockResolvedValue(null);
      mockCard.findByPk.mockResolvedValue({ id: 2 });
      await expect(tagService.linkTagToCard(1, 2)).rejects.toThrow();
      mockTag.findByPk.mockResolvedValue({ id: 1, addCard: jest.fn() });
      mockCard.findByPk.mockResolvedValue(null);
      await expect(tagService.linkTagToCard(1, 2)).rejects.toThrow();
    });
  });

  describe('unlinkTagFromCard', () => {
    it('should unlink a tag from a card', async () => {
      const mockTagInstance = { removeCard: jest.fn().mockResolvedValue(), id: 1 };
      const mockCardInstance = { id: 2 };
      mockTag.findByPk.mockResolvedValue(mockTagInstance);
      mockCard.findByPk.mockResolvedValue(mockCardInstance);
      const result = await tagService.unlinkTagFromCard(1, 2);
      expect(result).toBeDefined();
    });
    it('should throw error if tag or card not found', async () => {
      mockTag.findByPk.mockResolvedValue(null);
      mockCard.findByPk.mockResolvedValue({ id: 2 });
      await expect(tagService.unlinkTagFromCard(1, 2)).rejects.toThrow();
      mockTag.findByPk.mockResolvedValue({ id: 1, removeCard: jest.fn() });
      mockCard.findByPk.mockResolvedValue(null);
      await expect(tagService.unlinkTagFromCard(1, 2)).rejects.toThrow();
    });
  });
}); 