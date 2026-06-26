import { Request, Response, NextFunction } from "express";
import { AlertService } from "../services/alert.service";
import logger from "../utils/logger";
import { successResponse } from "../utils/response";

export class AlertController {
    constructor(private alertService: AlertService) {}

    getFilteredAlerts = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const { department, risk, page, limit } = req.query;

            const result = await this.alertService.getFilteredAlerts({
                department: department as string,
                risk: risk as string,
                page: parseInt(page as string) || 1,
                limit: parseInt(limit as string) || 20,
            });

            successResponse(res, {
                message: "Successfully fetched alert logs",
                meta: {
                    total_data: result.total,
                    page: result.page,
                    limit: result.limit,
                    total_pages: Math.ceil(result.total / result.limit),
                },
                data: result.data,
            });
        } catch (error) {
            logger.error("Error in getFilteredAlerts controller:", error);
            next(error);
        }
    };
}
