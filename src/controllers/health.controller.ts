import { Request, Response, NextFunction } from "express";
import { HealthService } from "../services/health.service";
import logger from "../utils/logger";

export class HealthController {
    constructor(private healthService: HealthService) {}

    checkHealth = async (_: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const health = await this.healthService.checkHealth();

            res.status(health.status === "healthy" ? 200 : 503).json({
                status: health.status,
                services: health.services,
                ...(health.error && { error: health.error }),
                timestamp: new Date().toISOString(),
            });
        } catch (error) {
            logger.error("Error in checkHealth controller:", error);
            next(error);
        }
    };
}
