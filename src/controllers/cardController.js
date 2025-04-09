import { Card } from "../models/Card.js";

const cardController = {

  async findAll(req, res) {

    try {
      
      const cards = await Card.findAll({
        include: ["list", "tags"],
        order: [
          ["position", "ASC"],
          ["created_at", "DESC"],
        ],
      });

      res.status(200).json(cards);

    } catch (error) {
      console.error("Erreur lors de la récupération des listes:", error);
      res.status(500).json({ message: "Erreur serveur lors de la récupération des listes." });  
    }
  },

  async findOne(req, res) {

    const cardId = req.params.id;

    try {
      const result = await Card.findByPk(cardId, {
        include: ["list", "tags"]});

      if (!result) {
        res.status(404).send("card not found");
      }

      res.status(200).json(result);

    } catch (error) {
      console.error("Erreur lors de la récupération de la carte:", error);
      res.status(500).json({ message: "Erreur serveur lors de la récupération de la carte." }); 
    }
  },

  async create(req, res) {

    try {
      const result = await Card.create(req.body);

      res.status(201).json(result);

    } catch (error) {
      console.error("Erreur lors de la création de la carte:", error);
      return next({statusCode: 400, message: "Erreur lors de l'enregistrement en BDD !!!"}); 
    }
  },
}

export { cardController };