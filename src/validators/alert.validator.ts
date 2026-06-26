import Joi from "joi";

export const alertFilterSchema = Joi.object({
    department: Joi.string().max(100).optional(),
    risk: Joi.string().valid("Low", "Medium", "High", "Critical").optional(),
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(100).default(20),
});
