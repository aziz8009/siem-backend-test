import Joi from "joi";

export const createHighlightedIPSchema = Joi.object({
    ip_address: Joi.string()
        .required()
        .pattern(/^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/)
        .messages({
            "string.pattern.base": "Invalid IP address format",
            "any.required": "IP address is required",
        }),
    reason: Joi.string().max(500).optional(),
    note: Joi.string().max(1000).optional(),
    created_by: Joi.string().max(100).required().email().messages({
        "string.email": "Invalid email format",
        "any.required": "Created by is required",
    }),
});

export const updateHighlightedIPSchema = Joi.object({
    reason: Joi.string().max(500).optional(),
    note: Joi.string().max(1000).optional(),
    is_active: Joi.boolean().optional(),
});
