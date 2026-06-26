import { esClient } from "../config/elasticsearch";
import { env } from "../config/environment";
import { ElasticsearchAlert, AlertQueryResponse } from "../types/alert.types";
import logger from "../utils/logger";

export class AlertRepository {
    private readonly index = env.elasticsearch.index;

    async findAlertsByTargetIPs(targetIPs: string[], page: number = 1, limit: number = 20): Promise<AlertQueryResponse> {
        try {
            if (!targetIPs.length) {
                return { total: 0, hits: [] };
            }

            const from = (page - 1) * limit;

            const response = await esClient.search<ElasticsearchAlert>({
                index: this.index,
                query: {
                    terms: {
                        network_target_ip: targetIPs,
                    },
                },
                from,
                size: limit,
                sort: [
                    {
                        timestamp: {
                            order: "desc",
                        },
                    },
                ],
                track_total_hits: true,
            });

            const hits = response.hits.hits.map((hit) => hit._source as ElasticsearchAlert);
            const total = typeof response.hits.total === "number" ? response.hits.total : response.hits.total?.value || 0;

            return { total, hits };
        } catch (error) {
            logger.error("Error fetching alerts by target IPs:", error);
            throw error;
        }
    }

    async getTopTargetedAssets(limit: number = 5): Promise<
        Array<{
            target_ip: string;
            total_attacks: number;
        }>
    > {
        try {
            const response = await esClient.search({
                index: this.index,
                size: 0,
                aggs: {
                    top_targets: {
                        terms: {
                            field: "network_target_ip",
                            size: limit,
                            order: {
                                _count: "desc",
                            },
                        },
                    },
                },
            });

            const buckets = (response.aggregations?.top_targets as any)?.buckets || [];

            return buckets.map((bucket: any) => ({
                target_ip: bucket.key,
                total_attacks: bucket.doc_count,
            }));
        } catch (error) {
            logger.error("Error fetching top targeted assets:", error);
            throw error;
        }
    }

    async findAlertsBySourceIPs(sourceIPs: string[], page: number = 1, limit: number = 20): Promise<AlertQueryResponse> {
        try {
            if (!sourceIPs.length) {
                return { total: 0, hits: [] };
            }

            const from = (page - 1) * limit;

            const response = await esClient.search<ElasticsearchAlert>({
                index: this.index,
                query: {
                    terms: {
                        src_ip: sourceIPs,
                    },
                },
                from,
                size: limit,
                sort: [
                    {
                        timestamp: {
                            order: "desc",
                        },
                    },
                ],
                track_total_hits: true,
            });

            const hits = response.hits.hits.map((hit) => hit._source as ElasticsearchAlert);
            const total = typeof response.hits.total === "number" ? response.hits.total : response.hits.total?.value || 0;

            return { total, hits };
        } catch (error) {
            logger.error("Error fetching alerts by source IPs:", error);
            throw error;
        }
    }

    async testConnection(): Promise<boolean> {
        try {
            await esClient.ping();
            return true;
        } catch (error) {
            logger.error("Elasticsearch connection test failed:", error);
            return false;
        }
    }
}
