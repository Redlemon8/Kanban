//src/services/projectService.js
import { Project } from "../models/association.js";
import { notFound } from "../utils/error.js";

const projectServie = {

  getAllProjects: async () => {

    const projects = await Project.findAll();
    return projects;
  },

  getProjectById: async (projectId) => {

    const project = await Project.findByPk(projectId, {
      include: ["lists", "cards", "tags"],
    });

    if (!project) {
      notFound(`Project with id ${projectId} not found`);
    }

    return project;
  },

  createProject: async (projectData) => {

    const project = await Project.create(projectData);
    return project;
  },

  updateProject: async (projectId, projectData) => {

    const project = await Project.findByPk(projectId);
    
    if (!project) {
      notFound(`Project with id ${projectId} not found`);
    }
    await project.update(projectData);
    return project;
  },

  deleteProject: async (projectId) => {
    const project = await Project.findByPk(projectId);
    if (!project) {
      notFound(`Project with id ${projectId} not found`);
    }
    await project.destroy();
    return project;
  },

  getProjectsByUser: async (userId) => {
    const projects = await Project.findAll({
      where: {
        user_id: userId,
      },
    });
    return projects;
  },
};

export default projectServie;