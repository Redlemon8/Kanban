import listService from "../services/listService.js";

const listController = {

  async findAll(req, res) {

    const lists = await listService.getAllLists();
    res.status(200).json(lists);
  },

  async findOne(req, res) {

    const listId = req.params.id

    const result = await listService.getListById(listId);
    res.status(200).json(result);
  },

  async create(req, res) {

    const result = await listService.createList(req.body);
    res.status(201).json(result);
  },

  async update(req, res) {

    const listId = req.params.id;
    const result = await listService.updateList(listId, req.body);
    res.status(200).json(result);
  },

  async delete(req, res) {

    const listId = req.params.id;
    await listService.deleteList(listId);
    res.sendStatus(204);
  },

  async delete (req, res) {

    const listId = req.params.id;
    await listService.deleteList(listId);
    res.sendStatus(204);
  }
}

  export { listController };