import { Card, Tag } from "../models/association.js";
import { notFound } from "../utils/error.js";

const tagController = {

  async findAll(req, res) {

      const tags = await Tag.findAll({
        include: { association: "cards", include: "list" },
        order: [["name", "ASC"]]
      })
      res.status(200).json(tags);
  },

  async findOne(req, res) {

    const tagId = req.params.id;

      const tag = await Tag.findByPk(tagId, {
        include: { association: "cards", include: "list" },
        order: [["name", "ASC"]]
      })

      if (!tag) {
        notFound(`Catégorie avec l'ID ${req.params.id} non trouvée`);
    }
      res.status(200).json(tag);
  },

  async create(req, res) {

      const result = await Tag.create(req.body);
      res.status(201).json(result);
  },

  async update(req, res) {

    const tag = await Tag.findByPk(req.params.id);

    if (!tag) {
      notFound(`Catégorie avec l'ID ${req.params.id} non trouvée`);
    }
    
    for (const key in req.body) {
      if (tag[key] !== undefined) {
        tag[key] = req.body[key];
      }
    }
    await tag.save();
    res.status(201).json(tag);
  },

  async delete(req, res) {

    const tag = await Tag.findByPk(req.params.id);

    if (!category) {
      notFound(`Catégorie avec l'ID ${req.params.id} non trouvée`);
    }

    await tag.destroy();
    res.status(204);
  },

  async linkTagToCard(req, res) {

      const card = await Card.findByPk(req.params.card_id);
      const tag = await Tag.findByPk(req.params.tag_id);
  
      if (!card || !tag) {
        notFound(`Catégorie avec l'ID ${req.params.id} non trouvée`);
      }

      await card.addTag(tag);
      res.status(200).json(await tag.reload({ include: { association: "cards", include: 'list' } }));
  },

  async deleteTagToCard(req, res) {

    const card = await Card.findByPk(req.params.card_id);
    const tag = await Tag.findByPk(req.params.tag_id);

    if (!card || !tag) {
      notFound(`Catégorie avec l'ID ${req.params.id} non trouvée`);
    }

    await card.destroy(tag);
    res.status(200).json(await tag.reload({ include: { association: "cards", include: 'list' } }));
  },
}

export { tagController };