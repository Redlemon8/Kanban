import { List } from "../models/association.js";

const listController = {

  async index(req, res) {

    try {

      const lists = await List.findAll({
        include: { association: "cards", include: "tags" },
        order: [
          ["position", "ASC"]
        ]
      });

      res.status(200).json(lists);

    } catch (error) {
      console.error("Erreur lors de la récupération des listes:", error);
      res.status(500).json({ message: "Erreur serveur lors de la récupération des listes." });
    }
  },

  async show(req, res) {

    const listId = req.params.id

    try {
      
      const result = await List.findByPk(listId, {
          include: { association: "cards", include: "tags" }
      });

      if (!result) {
        res.status(404).send("lists not found");
      }

      res.status(200).json(result);

    } catch (error) {
      console.error("Erreur lors de la récupération de la liste:", error);
      res.status(500).json({ message: "Erreur serveur lors de la récupération de la liste." });
    }
  },
}

  export { listController };