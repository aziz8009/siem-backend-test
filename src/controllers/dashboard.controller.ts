import { Request, Response, NextFunction } from "express";
import { DashboardService } from "../services/dashboard.service";
import logger from "../utils/logger";
import { successResponse } from "../utils/response";

export class DashboardController {
    constructor(private dashboardService: DashboardService) {}

    getTopTargetedAssets = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const limit = parseInt(req.query.limit as string) || 5;

            const data = await this.dashboardService.getTopTargetedAssets(limit);

            successResponse(res, {
                message: "Successfully fetched top targeted assets",
                meta: {
                    total_data: data.length,
                },
                data,
            });
        } catch (error) {
            logger.error("Error in getTopTargetedAssets controller:", error);
            next(error);
        }
    };
}
