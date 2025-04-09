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
      console.error("Erreur lors de la récupération des listes:", error);
      res.status(500).json({ message: "Erreur serveur lors de la récupération des listes." });
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
      console.error("Erreur lors de la récupération des listes:", error);
      res.status(500).json({ message: "Erreur serveur lors de la récupération des listes." }); 
    }
  },
}

export { tagController };