import { HighlightedIP, HighlightedIPAttributes } from "../models/highlighted-ip.model";
import logger from "../utils/logger";

export class HighlightedIPRepository {
    async create(data: Omit<HighlightedIPAttributes, "id" | "isActive">): Promise<HighlightedIP> {
        try {
            const highlightedIP = await HighlightedIP.create({
                ipAddress: data.ipAddress,
                reason: data.reason,
                note: data.note,
                createdBy: data.createdBy,
                isActive: true,
            });
            return highlightedIP;
        } catch (error) {
            logger.error("Error creating highlighted IP:", error);
            throw error;
        }
    }

    async findAll(activeOnly: boolean = true): Promise<HighlightedIP[]> {
        try {
            const where: any = {};
            if (activeOnly) {
                where.isActive = true;
            }

            const highlightedIPs = await HighlightedIP.findAll({
                where,
                order: [["createdAt", "DESC"]],
            });

            return highlightedIPs;
        } catch (error) {
            logger.error("Error fetching highlighted IPs:", error);
            throw error;
        }
    }

    async findById(id: number): Promise<HighlightedIP | null> {
        try {
            const highlightedIP = await HighlightedIP.findByPk(id);
            return highlightedIP;
        } catch (error) {
            logger.error(`Error fetching highlighted IP with id ${id}:`, error);
            throw error;
        }
    }

    async findByIP(ipAddress: string): Promise<HighlightedIP | null> {
        try {
            const highlightedIP = await HighlightedIP.findOne({
                where: { ipAddress },
            });
            return highlightedIP;
        } catch (error) {
            logger.error(`Error fetching highlighted IP with address ${ipAddress}:`, error);
            throw error;
        }
    }

    async update(id: number, data: Partial<HighlightedIPAttributes>): Promise<HighlightedIP | null> {
        try {
            const highlightedIP = await this.findById(id);
            if (!highlightedIP) {
                return null;
            }

            await highlightedIP.update(data);
            return highlightedIP;
        } catch (error) {
            logger.error(`Error updating highlighted IP with id ${id}:`, error);
            throw error;
        }
    }

    async softDelete(id: number): Promise<boolean> {
        try {
            const highlightedIP = await this.findById(id);
            if (!highlightedIP) {
                return false;
            }

            await highlightedIP.update({ isActive: false });
            return true;
        } catch (error) {
            logger.error(`Error soft deleting highlighted IP with id ${id}:`, error);
            throw error;
        }
    }

    async hardDelete(id: number): Promise<boolean> {
        try {
            const deleted = await HighlightedIP.destroy({
                where: { id },
            });
            return deleted > 0;
        } catch (error) {
            logger.error(`Error hard deleting highlighted IP with id ${id}:`, error);
            throw error;
        }
    }

    async getActiveIPs(): Promise<string[]> {
        try {
            const highlightedIPs = await HighlightedIP.findAll({
                where: { isActive: true },
                attributes: ["ipAddress"],
                raw: true,
            });

            return highlightedIPs.map((item) => item.ipAddress);
        } catch (error) {
            logger.error("Error fetching active highlighted IPs:", error);
            throw error;
        }
    }
}
