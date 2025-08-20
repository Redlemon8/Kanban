//src/services/listService.js
import { List, Card, Project } from '../models/association.js';
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

  async getAllListsByProject(projectId) {
    // Vérifier que le projet existe
    const project = await Project.findByPk(projectId);
    if (!project) {
      notFound(`Projet avec l'ID ${projectId} non trouvé`);
    }

    const lists = await List.findAll({
      where: { project_id: projectId },
      include: [
        {
          association: "cards",
          include: "tags"
        }
      ],
    });
    return lists;
  },

  async getListById(listId, projectId = null) {
    const whereClause = { id: listId };
    if (projectId) {
      // Vérifier que le projet existe
      const project = await Project.findByPk(projectId);
      if (!project) {
        notFound(`Projet avec l'ID ${projectId} non trouvé`);
      }
      whereClause.project_id = projectId;
    }

    const list = await List.findOne({
      where: whereClause,
      include: [
        {
          association: "cards",
          include: "tags"
        }
      ],
    });
    if (!list) {
      notFound(`Liste avec l'ID ${listId} non trouvée${projectId ? ` dans le projet ${projectId}` : ''}`);
    }
    return list;
  },

  async createList(projectId, listData) {

    const project = await Project.findByPk(projectId);

    if (!project) {
      notFound(`Projet avec l'ID ${projectId} non trouvé`);
    }

    const listDataWithProject = {
      ...listData,
      project_id: projectId
    };

    const newList = await List.create(listDataWithProject);
    return newList;
  },

  async updateList(listId, listData, projectId = null) {
    const whereClause = { id: listId };
    if (projectId) {
      // Vérifier que le projet existe
      const project = await Project.findByPk(projectId);
      if (!project) {
        notFound(`Projet avec l'ID ${projectId} non trouvé`);
      }
      whereClause.project_id = projectId;
    }

    const list = await List.findOne({ where: whereClause });
    if (!list) {
      notFound(`Liste avec l'ID ${listId} non trouvée${projectId ? ` dans le projet ${projectId}` : ''}`);
    }
    await list.update(listData);
    return await this.getListById(listId, projectId);
  },

  async deleteList(listId, projectId = null) {
    const whereClause = { id: listId };
    if (projectId) {
      // Vérifier que le projet existe
      const project = await Project.findByPk(projectId);
      if (!project) {
        notFound(`Projet avec l'ID ${projectId} non trouvé`);
      }
      whereClause.project_id = projectId;
    }

    const list = await List.findOne({ where: whereClause });
    if (!list) {
      notFound(`Liste avec l'ID ${listId} non trouvée${projectId ? ` dans le projet ${projectId}` : ''}`);
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