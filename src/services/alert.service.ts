import { AlertRepository } from "../repositories/alert.repository";
import { AssetRepository } from "../repositories/asset.repository";
import { AlertResponse, AlertFilterParams } from "../types/alert.types";
import logger from "../utils/logger";

export class AlertService {
    constructor(
        private alertRepository: AlertRepository,
        private assetRepository: AssetRepository,
    ) {}

    async getFilteredAlerts(params: AlertFilterParams): Promise<{
        data: AlertResponse[];
        total: number;
        page: number;
        limit: number;
    }> {
        try {
            // Step 1: Get assets from PostgreSQL based on filters
            const assets = await this.assetRepository.findAssetsByFilters(params.department, params.risk);

            if (!assets.length) {
                return {
                    data: [],
                    total: 0,
                    page: params.page,
                    limit: params.limit,
                };
            }

            // Step 2: Extract IP addresses
            const targetIPs = assets.map((asset) => asset.hostIdentifierLocal);

            // Step 3: Get alerts from Elasticsearch
            const result = await this.alertRepository.findAlertsByTargetIPs(targetIPs, params.page, params.limit);

            // Step 4: Transform response
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
                page: params.page,
                limit: params.limit,
            };
        } catch (error) {
            logger.error("Error in getFilteredAlerts:", error);
            throw error;
        }
    }
}
