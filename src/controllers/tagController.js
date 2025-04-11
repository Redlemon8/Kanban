import { Card, Tag } from "../models/association.js";

const tagController = {

  async findAll(req, res) {
  
    try {
    
      const tags = await Tag.findAll({
        include: { association: "cards", include: "list" },
        order: [["name", "ASC"]]
      })
      res.status(200).json(tags);

    } catch (error) {
      console.error("Erreur lors de la récupération des tags:", error);
      res.status(500).json({ message: "Erreur serveur lors de la récupération des tags." });
    }

  },

  async findOne(req, res) {

    const tagId = req.params.id;
    
    try {
      
      const tag = await Tag.findByPk(tagId, {
        include: { association: "cards", include: "list" },
        order: [["name", "ASC"]]
      })
      res.status(200).json(tag);

    } catch (error) {
      console.error("Erreur lors de la récupération du tag:", error);
      res.status(500).json({ message: "Erreur serveur lors de la récupération du tag." }); 
    }
  },

  async create(req, res) {

    try {
      
      const result = await Tag.create(req.body);

      res.status(201).json(result);

    } catch (error) {
      console.error("Erreur lors de la création du tag:", error);
      res.status(400).json({ message: "Erreur lors de l'enregistrement en BDD !!!"});
    }
  },

  async update(req, res) {

    try {
      
      const tag = await Tag.findByPk(req.params.id);

      if (!tag) {
        return res.status(404).send("404 not found !");
      }
      
      for (const key in req.body) {

        if (tag[key] !== undefined) {

          tag[key] = req.body[key];
        }
      }

      await tag.save();

      res.status(201).json(tag);

    } catch (error) {
      console.error("Erreur lors de la création du tag:", error);
      res.status(400).json({ message: "Erreur lors de l'enregistrement en BDD !!!"});
    }
  },

  async delete(req, res) {

    try {
      
      const tag = await Tag.findByPk(req.params.id);

      if (!tag) {
        return res.status(404).send("404 not found !");
      }
  
      await tag.destroy();
      res.status(204);

    } catch (error) {
      console.error("Erreur lors de la suppression du tag:", error);
      res.status(400).json({ message: "Erreur lors de la suppression en BDD !!!"});
    }
  },

  async linkTagToCard(req, res) {

    try {
      
      const card = await Card.findByPk(req.params.card_id);
      const tag = await Tag.findByPk(req.params.tag_id);
  
      if (!card || !tag) {
        return res.status(404).send("404 not found !");
      }
  
      await card.addTag(tag);
  
      res.status(200).json(await tag.reload({ include: { association: "cards", include: 'list' } }));

    } catch (error) {
      console.error("Erreur lors de la mise a jour du tag:", error);
      res.status(400).json({ message: "Erreur lors de la mise a jour en BDD !!!"});
    }

  },

  async deleteTagToCard(req, res) {

    try {
      
      const card = await Card.findByPk(req.params.card_id);
      const tag = await Tag.findByPk(req.params.tag_id);

      if (!tag || !card) {
        return res.status(404).send("404 not found !");
      }
  
      await card.destroy(tag);
      res.status(200).json(await tag.reload({ include: { association: "cards", include: 'list' } }));

    } catch (error) {
      console.error("Erreur lors de la suppression du tag:", error);
      res.status(400).json({ message: "Erreur lors de la suppression en BDD !!!"});
    }
  },
}

export { tagController };