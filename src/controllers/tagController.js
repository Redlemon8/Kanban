import { Tag } from "../models/Tag.js"

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
      
      const { name, color } = req.body;

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
  }
}

export { tagController };