import { Request, Response, NextFunction } from "express";
import logger from "../utils/logger";
import { errorResponse } from "../utils/response";

export const errorHandler = (err: any, req: Request, res: Response, _: NextFunction): void => {
    logger.error(`Error: ${err.message}`, {
        stack: err.stack,
        path: req.path,
        method: req.method,
    });

    // Handle Sequelize validation errors
    if (err.name === "SequelizeValidationError") {
        errorResponse(res, err.message, 400, "Validation Error");
        return;
    }

    // Handle Sequelize unique constraint errors
    if (err.name === "SequelizeUniqueConstraintError") {
        errorResponse(res, "Duplicate entry found", 409, "Unique Constraint Error");
        return;
    }

    // Handle custom errors
    if (err.statusCode) {
        errorResponse(res, err.message, err.statusCode, err.type || "Error");
        return;
    }

    // Default error
    errorResponse(res, "Internal server error", 500, process.env.NODE_ENV === "development" ? err.message : "Server Error");
};
