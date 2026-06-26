import { AlertRepository } from "../repositories/alert.repository";
import { AssetRepository } from "../repositories/asset.repository";
import { AggregatedAlert } from "../types/alert.types";
import logger from "../utils/logger";

export class DashboardService {
    constructor(
        private alertRepository: AlertRepository,
        private assetRepository: AssetRepository,
    ) {}

    async getTopTargetedAssets(limit: number = 5): Promise<AggregatedAlert[]> {
        try {
            // Step 1: Get top targeted IPs from Elasticsearch
            const topTargets = await this.alertRepository.getTopTargetedAssets(limit);

            if (!topTargets.length) {
                return [];
            }

            // Step 2: Get asset information from PostgreSQL
            const targetIPs = topTargets.map((item) => item.target_ip);
            const assets = await this.assetRepository.findAssetsByIPs(targetIPs);

            // Step 3: Create a map for quick lookup
            const assetMap = new Map();
            assets.forEach((asset) => {
                assetMap.set(asset.hostIdentifierLocal, {
                    assetName: asset.assetName,
                    department: asset.departmentOwner,
                });
            });

            // Step 4: Enrich the data
            const enrichedData = topTargets.map((item) => {
                const assetInfo = assetMap.get(item.target_ip);
                return {
                    target_ip: item.target_ip,
                    total_attacks: item.total_attacks,
                    asset_name: assetInfo?.assetName || "Unknown Asset",
                    department: assetInfo?.department || "Unknown Department",
                };
            });

            return enrichedData;
        } catch (error) {
            logger.error("Error in getTopTargetedAssets:", error);
            throw error;
        }
    }
}
