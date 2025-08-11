import Joi from "joi";
import { createSchema } from "../utils/schema.js";

const projectBaseSchema = {
  name: Joi.string().min(3).messages({
    "string.base": "Le nom doit être une chaîne de caractères",
    "string.min": "Le nom doit contenir au moins {#limit} caractères",
    "any.required": "Le champ nom est obligatoire",
  }),
};

export const createProjectSchema = createSchema(projectBaseSchema, ["name"]);
export const updateProjectSchema = createSchema(projectBaseSchema);