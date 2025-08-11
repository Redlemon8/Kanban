import projectService from "../services/projectService.js";

const projectController = {

  getAllProjects: async (req, res) => {
    const projects = await projectService.getAllProjects();
    res.json(projects);
  },

  getProjectById: async (req, res) => {
    const project = await projectService.getProjectById(req.params.id);
    res.json(project);
  },

  createProject: async (req, res) => {
    const project = await projectService.createProject(req.body);
    res.json(project);
  },

  updateProject: async (req, res) => {
    const project = await projectService.updateProject(req.params.id, req.body);
    res.json(project);
  },

  deleteProject: async (req, res) => {
    await projectService.deleteProject(req.params.id);
    res.status(204).send();
  },
  
};

export default projectController;