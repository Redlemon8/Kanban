import Joi from "joi";

const createTagSchema = Joi.object({
  name: Joi.string().min(3).max(50).required().messages({
      "string.base": "Le nom doit être une chaîne de caractères",
      "string.min": "Le nom doit contenir au moins {#limit} caractères",
      "string.max": "Le nom doit contenir au plus {#limit} caractères",
      "any.requires": "Le champ nom est obligatoire"
  }),
  color: Joi.string().regex(/^#([0-9a-fA-F]{3}){1,2}$/).messages({
      "string.pattern.base": "La couleur doit être un code hexadécimal valide",
  }),
});

const updateTagSchema = Joi.object({
  name: Joi.string().min(3).max(50).messages({
      "string.base": "Le nom doit être une chaîne de caractères",
      "string.min": "Le nom doit contenir au moins {#limit} caractères",
      "string.max": "Le nom doit contenir au plus {#limit} caractères",
  }),
  color: Joi.string().regex(/^#([0-9a-fA-F]{3}){1,2}$/).messages({
      "string.pattern.base": "La couleur doit être un code hexadécimal valide",
  }),
});

export { createTagSchema, updateTagSchema }