import { Request, Response, NextFunction } from "express";
import Joi from "joi";
import { errorResponse } from "../utils/response";

export const validate = (schema: Joi.ObjectSchema) => {
    return (req: Request, res: Response, next: NextFunction): void => {
        const { error } = schema.validate(req.body || req.query);

        if (error) {
            const message = error.details.map((detail) => detail.message).join(", ");
            errorResponse(res, message, 400, "Validation Error");
            return;
        }

        next();
    };
};
