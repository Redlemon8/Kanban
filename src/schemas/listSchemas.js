import Joi from "joi";
import { createSchema } from "../utils/schema.js";

// Schéma de base avec les validations communes
const listBaseSchema = {
  title: Joi.string().min(3).max(100).messages({
    "string.base": "Le titre doit être une chaîne de caractères",
    "string.min": "Le titre doit contenir au moins 3 caractères",
    "string.max": "Le titre doit contenir au plus 100 caractères",
    "any.required": "Le champ titre est obligatoire"
  }),
  position: Joi.number().integer().greater(0).messages({
    "number.base": "La position doit être un nombre",
    "number.integer": "La position doit être un nombre entier",
    "number.greater": "La position doit être supérieure à 0",
  }),
};

// Schémas finaux
const createListSchema = createSchema(listBaseSchema, ['title']);
const updateListSchema = createSchema(listBaseSchema);

export { createListSchema, updateListSchema };