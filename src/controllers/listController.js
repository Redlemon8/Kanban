import listService from "../services/listService.js";

const listController = {

  async findAll(req, res) {

    const projectId = req.params.id;
    const lists = await listService.getAllListsByProject(projectId);
    res.status(200).json(lists);
  },

  async findOne(req, res) {

    const projectId = req.params.projectId;
    const listId = req.params.id;

    const result = await listService.getListById(listId, projectId);
    res.status(200).json(result);
  },

  async create(req, res) {

    const projectId = req.params.id;

    const result = await listService.createList(projectId, req.body);
    res.status(201).json(result);
  },

  async update(req, res) {

    const projectId = req.params.projectId;
    const listId = req.params.id;
    const result = await listService.updateList(listId, req.body, projectId);
    res.status(200).json(result);
  },

  async delete(req, res) {

    const projectId = req.params.projectId;
    const listId = req.params.id;
    await listService.deleteList(listId, projectId);
    res.sendStatus(204);
  }
}

  export { listController };