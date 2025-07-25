//src/utils/schema.js
import Joi from "joi";

/**
 * Crée un schéma Joi avec des champs requis conditionnels
 * @param {Object} baseSchema - Le schéma de base avec les validations communes
 * @param {Array} requiredFields - Les champs qui doivent être requis
 * @returns {Joi.ObjectSchema} Le schéma Joi final
 */
export const createSchema = (baseSchema, requiredFields = []) => {
  const schema = { ...baseSchema };
  
  requiredFields.forEach(field => {
    if (schema[field]) {
      schema[field] = schema[field].required();
    }
  });
  
  return Joi.object(schema);
}; 