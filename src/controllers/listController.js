import Joi from "joi";
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

  async create(req, res) {

    const error = listController.validate(req);

    if (error) {
      res.send(error);
    }

    try {

        const result = await List.create(req.body);

        res.status(201).json(result);

    } catch (error) {
      console.error("Erreur lors de la création de la liste:", error);
      res.status(400).json({ message: "Erreur lors de l'enregistrement en BDD !!!" });
    }
  },

  async update(req, res) {

    const error = listController.validate(req);

    if (error) {
      res.send(error);
    }

    try {

      const list = await List.findByPk(req.params.id, {
        include: { association: "cards", include: "tags" }
      });

      if (!list) {
        return res.status(404).send("404 not found !");
      }

      const { title, position } = req.body;

      if (title) {
        list.title = title;
      }

      if (position) {
          list.position = position;
      }

      await list.save();

      res.status(200).json(list);

    } catch (error) {
      console.error("Erreur lors de la création de la liste:", error);
      res.status(400).json({ message: "Erreur lors de l'enregistrement en BDD !!!" });
    }
  },

  async delete (req, res) {

    try {

      const list = await List.findByPk(req.params.id, {
        include: { association: "cards", include: "tags" }
      });

      if (!list) {
        return res.status(404).send("404 not found !");
      }

      await list.destroy();

      res.sendStatus(204);

    } catch (error) {
      console.error("Erreur lors de la création de la liste:", error);
      res.status(400).json({ message: "Erreur lors de l'enregistrement en BDD !!!" });
    }
  },

  validate(req) {

    let schema = Joi.object({
        title: Joi.string().min(3).max(100).messages({
            "string.base": "Le titre doit être une chaîne de caractères",
            "string.min": "Le titre doit contenir au moins 3 caractères",
            "string.max": "Le titre doit contenir au plus 100 caractères",
        }),
        position: Joi.number().integer().greater(0).messages({
            "number.base": "La position doit être un nombre",
            "number.integer": "La position doit être un nombre entier",
            "number.greater": "La position doit être supérieure à 0",
        }),
    });

    if (req.method === "POST") {

        schema = schema.fork(['title'], field => field.required().messages({
            "any.required": "Le titre est requis",
        }));
    }

    const error = schema.validate(req.body, { abortEarly: false }).error;

    return error
        ? {statusCode: 400, message: error.details.map(detail => detail.message)}
        : null;
  }

}

  export { listController };