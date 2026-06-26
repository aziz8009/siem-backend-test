import { Asset, AssetAttributes } from "../models/asset.model";
import { Op } from "sequelize";
import logger from "../utils/logger";

export class AssetRepository {
    async findAssetsByFilters(department?: string, risk?: string): Promise<AssetAttributes[]> {
        try {
            const where: any = {};

            if (department) {
                where.departmentOwner = department;
            }

            if (risk) {
                where.riskLevel = risk;
            }

            const assets = await Asset.findAll({
                where,
                attributes: ["hostIdentifierLocal"],
                raw: true,
            });

            return assets;
        } catch (error) {
            logger.error("Error fetching assets by filters:", error);
            throw error;
        }
    }

    async findAssetsByIPs(ips: string[]): Promise<AssetAttributes[]> {
        try {
            if (!ips.length) return [];

            const assets = await Asset.findAll({
                where: {
                    hostIdentifierLocal: {
                        [Op.in]: ips,
                    },
                },
                attributes: ["hostIdentifierLocal", "assetName", "departmentOwner"],
                raw: true,
            });

            return assets;
        } catch (error) {
            logger.error("Error fetching assets by IPs:", error);
            throw error;
        }
    }

    async findAllAssets(): Promise<AssetAttributes[]> {
        try {
            const assets = await Asset.findAll({
                attributes: ["hostIdentifierLocal"],
                raw: true,
            });
            return assets;
        } catch (error) {
            logger.error("Error fetching all assets:", error);
            throw error;
        }
    }
}
