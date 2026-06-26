import { Request, Response, NextFunction } from "express";
import { HighlightedIPService } from "../services/highlighted-ip.service";
import logger from "../utils/logger";
import { errorResponse, successResponse } from "../utils/response";

export class HighlightedIPController {
    constructor(private highlightedIPService: HighlightedIPService) {}

    createHighlightedIP = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const { ip_address, reason, note, created_by } = req.body;

            const data = await this.highlightedIPService.addHighlightedIP({
                ipAddress: ip_address,
                reason,
                note,
                createdBy: created_by,
            });

            successResponse(res, {
                message: "IP address added to highlighted list successfully",
                data,
            });
        } catch (error) {
            logger.error("Error in createHighlightedIP controller:", error);
            next(error);
        }
    };

    getAllHighlightedIPs = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const activeOnly = req.query.active_only !== "false";
            const data = await this.highlightedIPService.getAllHighlightedIPs(activeOnly);

            successResponse(res, {
                message: "Highlighted IPs retrieved successfully",
                meta: {
                    total_data: data.length,
                },
                data,
            });
        } catch (error) {
            logger.error("Error in getAllHighlightedIPs controller:", error);
            next(error);
        }
    };

    getHighlightedIPById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const id = parseInt(req.params.id as string, 10);
            const data = await this.highlightedIPService.getHighlightedIPById(id);

            if (!data) {
                errorResponse(res, "Highlighted IP not found", 404);
                return;
            }

            successResponse(res, {
                message: "Highlighted IP retrieved successfully",
                data,
            });
        } catch (error) {
            logger.error("Error in getHighlightedIPById controller:", error);
            next(error);
        }
    };

    updateHighlightedIP = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const id = parseInt(req.params.id as string, 10);
            const { reason, note, is_active } = req.body;

            const data = await this.highlightedIPService.updateHighlightedIP(id, {
                reason,
                note,
                isActive: is_active,
            });

            if (!data) {
                errorResponse(res, "Highlighted IP not found", 404);
                return;
            }

            successResponse(res, {
                message: "Highlighted IP updated successfully",
                data,
            });
        } catch (error) {
            logger.error("Error in updateHighlightedIP controller:", error);
            next(error);
        }
    };

    deleteHighlightedIP = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const id = parseInt(req.params.id as string, 10);
            const permanent = req.query.permanent === "true";

            const deleted = await this.highlightedIPService.deleteHighlightedIP(id, permanent);

            if (!deleted) {
                errorResponse(res, "Highlighted IP not found", 404);
                return;
            }

            successResponse(res, {
                message: "Highlighted IP deleted successfully",
            });
        } catch (error) {
            logger.error("Error in deleteHighlightedIP controller:", error);
            next(error);
        }
    };

    getActivityByHighlightedIPs = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const page = parseInt(req.query.page as string) || 1;
            const limit = parseInt(req.query.limit as string) || 20;

            const result = await this.highlightedIPService.getActivityByHighlightedIPs(page, limit);

            successResponse(res, {
                message: "Successfully retrieved activity for highlighted IPs",
                meta: {
                    total_data: result.total,
                    page,
                    limit,
                    highlighted_ips: result.highlightedIPs,
                },
                data: result.data,
            });
        } catch (error) {
            logger.error("Error in getActivityByHighlightedIPs controller:", error);
            next(error);
        }
    };
}
