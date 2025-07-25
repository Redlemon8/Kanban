import Joi from "joi";
import { createSchema } from "../utils/schema.js";

// Schéma de base avec les validations communes
const tagBaseSchema = {
  name: Joi.string().min(3).max(50).messages({
    "string.base": "Le nom doit être une chaîne de caractères",
    "string.min": "Le nom doit contenir au moins {#limit} caractères",
    "string.max": "Le nom doit contenir au plus {#limit} caractères",
    "any.required": "Le champ nom est obligatoire"
  }),
  color: Joi.string().regex(/^#([0-9a-fA-F]{3}){1,2}$/).messages({
    "string.pattern.base": "La couleur doit être un code hexadécimal valide",
  }),
};

// Schémas finaux
const createTagSchema = createSchema(tagBaseSchema, ['name']);
const updateTagSchema = createSchema(tagBaseSchema);

export { createTagSchema, updateTagSchema };