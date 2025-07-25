//src/schemas/cardSchemas.js
import Joi from "joi";
import { createSchema } from "../utils/schema.js";

// Schéma de base avec les validations communes
const cardBaseSchema = {
  content: Joi.string().min(3).messages({
    "string.base": "Le contenu doit être une chaîne de caractères",
    "string.min": "Le contenu doit contenir au moins {#limit} caractères",
    "any.required": "Le champ contenu est obligatoire",
  }),
  position: Joi.number().integer().greater(0).messages({
    "number.base": "La position doit être un nombre",
    "number.integer": "La position doit être un nombre entier",
    "number.greater": "La position doit être supérieure à {#limit}",
  }),
  color: Joi.string().regex(/^#([0-9a-fA-F]{3}){1,2}$/).messages({
    "string.pattern.base": "La couleur doit être un code hexadécimal valide",
  }),
  list_id: Joi.number().integer().greater(0).messages({
    "number.base": "L'identifiant de la liste doit être un nombre",
    "number.integer": "L'identifiant de la liste doit être un nombre entier",
    "number.greater": "L'identifiant de la liste doit être supérieur à {#limit}",
  }),
};

// Schémas finaux
const createCardSchema = createSchema(cardBaseSchema, ['content']);
const updateCardSchema = createSchema(cardBaseSchema);

export { createCardSchema, updateCardSchema };