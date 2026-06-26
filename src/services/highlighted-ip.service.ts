import { HighlightedIPRepository } from "../repositories/highlighted-ip.repository";
import { AlertRepository } from "../repositories/alert.repository";
import { HighlightedIPAttributes } from "../models/highlighted-ip.model";
import { AlertResponse } from "../types/alert.types";
import logger from "../utils/logger";

export class HighlightedIPService {
    constructor(
        private highlightedIPRepository: HighlightedIPRepository,
        private alertRepository: AlertRepository,
    ) {}

    async addHighlightedIP(data: { ipAddress: string; reason?: string; note?: string; createdBy: string }): Promise<HighlightedIPAttributes> {
        try {
            // Check if IP already exists
            const existing = await this.highlightedIPRepository.findByIP(data.ipAddress);
            if (existing) {
                throw new Error("IP address already exists in highlighted list");
            }

            const highlightedIP = await this.highlightedIPRepository.create({
                ipAddress: data.ipAddress,
                reason: data.reason || null,
                note: data.note || null,
                createdBy: data.createdBy,
            });

            return this.toAttributes(highlightedIP);
        } catch (error) {
            logger.error("Error in addHighlightedIP:", error);
            throw error;
        }
    }

    async getAllHighlightedIPs(activeOnly: boolean = true): Promise<HighlightedIPAttributes[]> {
        try {
            const highlightedIPs = await this.highlightedIPRepository.findAll(activeOnly);
            return highlightedIPs.map((ip) => this.toAttributes(ip));
        } catch (error) {
            logger.error("Error in getAllHighlightedIPs:", error);
            throw error;
        }
    }

    async getHighlightedIPById(id: number): Promise<HighlightedIPAttributes | null> {
        try {
            const highlightedIP = await this.highlightedIPRepository.findById(id);
            return highlightedIP ? this.toAttributes(highlightedIP) : null;
        } catch (error) {
            logger.error(`Error in getHighlightedIPById for id ${id}:`, error);
            throw error;
        }
    }

    async updateHighlightedIP(
        id: number,
        data: {
            reason?: string;
            note?: string;
            isActive?: boolean;
        },
    ): Promise<HighlightedIPAttributes | null> {
        try {
            const updated = await this.highlightedIPRepository.update(id, {
                reason: data.reason,
                note: data.note,
                isActive: data.isActive,
            });

            return updated ? this.toAttributes(updated) : null;
        } catch (error) {
            logger.error(`Error in updateHighlightedIP for id ${id}:`, error);
            throw error;
        }
    }

    async deleteHighlightedIP(id: number, permanent: boolean = false): Promise<boolean> {
        try {
            if (permanent) {
                return await this.highlightedIPRepository.hardDelete(id);
            } else {
                return await this.highlightedIPRepository.softDelete(id);
            }
        } catch (error) {
            logger.error(`Error in deleteHighlightedIP for id ${id}:`, error);
            throw error;
        }
    }

    async getActivityByHighlightedIPs(
        page: number = 1,
        limit: number = 20,
    ): Promise<{
        data: AlertResponse[];
        total: number;
        highlightedIPs: string[];
    }> {
        try {
            // Step 1: Get active highlighted IPs
            const highlightedIPs = await this.highlightedIPRepository.getActiveIPs();

            if (!highlightedIPs.length) {
                return {
                    data: [],
                    total: 0,
                    highlightedIPs: [],
                };
            }

            // Step 2: Get alerts from Elasticsearch
            const result = await this.alertRepository.findAlertsBySourceIPs(highlightedIPs, page, limit);

            // Step 3: Transform response
            const data = result.hits.map((alert) => ({
                timestamp: alert.timestamp,
                source_ip: alert.src_ip,
                target_ip: alert.network_target_ip,
                alert_name: alert.signature_name,
                severity: alert.severity,
            }));

            return {
                data,
                total: result.total,
                highlightedIPs,
            };
        } catch (error) {
            logger.error("Error in getActivityByHighlightedIPs:", error);
            throw error;
        }
    }

    private toAttributes(model: any): HighlightedIPAttributes {
        return {
            id: model.id,
            ipAddress: model.ipAddress,
            reason: model.reason,
            note: model.note,
            createdBy: model.createdBy,
            isActive: model.isActive,
        };
    }
}
