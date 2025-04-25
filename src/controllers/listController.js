import { List } from "../models/association.js";
import { notFound } from "../utils/error.js";

const listController = {

  async findAll(req, res) {

    const lists = await List.findAll({
      include: { association: "cards", include: "tags" },
      order: [
        ["position", "ASC"]
      ]
    });

    res.status(200).json(lists);
  },

  async findOne(req, res) {

    const listId = req.params.id

    const result = await List.findByPk(listId, {
        include: { association: "cards", include: "tags" }
    });

    if (!result) {
      notFound(`Catégorie avec l'ID ${req.params.id} non trouvée`);
    }

    res.status(200).json(result);
  },

  async create(req, res) {

    const result = await List.create(req.body);
    res.status(201).json(result);
  },

  async update(req, res) {

    const list = await List.findByPk(req.params.id, {
      include: { association: "cards", include: "tags" }
    });

      if (!list) {
        notFound(`Catégorie avec l'ID ${req.params.id} non trouvée`);
    }

    const { title, position } = req.body;

    for (const key in req.body) {
      if (list[key] !== undefined) {
        list[key] = req.body[key];
      }
    }
    await list.save();
    res.status(200).json(list);
  },

  async delete (req, res) {

    const list = await List.findByPk(req.params.id, {
      include: { association: "cards", include: "tags" }
    });

    if (!list) {
      notFound(`Catégorie avec l'ID ${req.params.id} non trouvée`);
    }

    await list.destroy();
    res.sendStatus(204);
  }
}

  export { listController };