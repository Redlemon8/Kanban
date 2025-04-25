import { Card, List } from "../models/association.js";
import { notFound } from "../utils/error.js";

const cardController = {

  async findAll(req, res) {

    const cards = await Card.findAll({
      include: ["list", "tags"],
      order: [
        ["position", "ASC"],
        ["created_at", "DESC"],
      ],
    });

    res.status(200).json(cards);
  },

  async findOne(req, res) {

    const cardId = req.params.id;
      const result = await Card.findByPk(cardId, {
        include: ["list", "tags"]});

    if (!result) {
      notFound(`Catégorie avec l'ID ${req.params.id} non trouvée`);
    }
    res.status(200).json(result);
  },

  async create(req, res) {

    const result = await Card.create(req.body);
    res.status(201).json(result);
  },
  
  async update(req, res) {

    const card = await Card.findByPk(req.params.id, {
      include: ["list", "tags"]
    });

    if (!card) {
      notFound(`Catégorie avec l'ID ${req.params.id} non trouvée`);
    }

    // LOOP TO KEEP INPUT VALUE
    for (const key in req.body) {
      if (card[key] !== undefined) {
        card[key] = req.body[key];
      }
    }

    await card.save();
    res.status(200).json(card);
  },

  async delete(req, res, next) {

    const card = await Card.findByPk(req.params.id);

    if (!card) {
      notFound(`Catégorie avec l'ID ${req.params.id} non trouvée`);
    }
    await card.destroy();
    res.sendStatus(204);
  },

  async cardsByList(req, res, next) {
  
    const list = await List.findByPk(req.params.id, {
      include: { association: "cards", include: ["list", "tags"] },
    });

    if (!list) {
      notFound(`Catégorie avec l'ID ${req.params.id} non trouvée`);
    }
    res.status(200).json(list.cards);
  },
}

export { cardController };