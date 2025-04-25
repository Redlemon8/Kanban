import Joi from "joi";

const createListSchema = Joi.object({
  title: Joi.string().min(3).max(100).required().messages({
      "string.base": "Le titre doit être une chaîne de caractères",
      "string.min": "Le titre doit contenir au moins 3 caractères",
      "string.max": "Le titre doit contenir au plus 100 caractères",
      "any.required": "Le champ titre est obliagtoire"
  }),
  position: Joi.number().integer().greater(0).messages({
      "number.base": "La position doit être un nombre",
      "number.integer": "La position doit être un nombre entier",
      "number.greater": "La position doit être supérieure à 0",
  }),
});

const updateListSchema = Joi.object({
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

export { createListSchema, updateListSchema }