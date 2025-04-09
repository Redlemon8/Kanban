import { Card } from "../models/Card.js";
import { List } from "../models/List.js";

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

  async update(req, res) {
  
    try {

      const card = await Card.findByPk(req.params.id, {
        include: ["list", "tags"]
      });

      if (!card) {
        return res.status(404).send("404 not found !");
      }

      // LOOP TO KEEP INPUT VALUE
      for (const key in req.body) {

        if (card[key] !== undefined) {

          card[key] = req.body[key];
        }
      }

      await card.save();

      res.status(200).json(card);

    } catch (error) {
      console.error("Erreur lors de la création de la liste:", error);
      res.status(400).json({ message: "Erreur lors de l'enregistrement en BDD !!!" });
    }
  },

  async delete(req, res, next) {

    const card = await Card.findByPk(req.params.id);

    if (!card) {
      return res.status(404).send("404 not found !");
    }

    await card.destroy();

    res.sendStatus(204);
  },

  async cardsByList(req, res, next) {
  
    const list = await List.findByPk(req.params.id, {
      include: { association: "cards", include: ["list", "tags"] },
    });

    if (!list) {
      return res.status(404).send("404 not found !");
    }

    res.status(200).json(list.cards);
  },

}

export { cardController };