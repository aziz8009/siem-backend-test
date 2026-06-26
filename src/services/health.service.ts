import { sequelize } from "../config/database";
import { esClient } from "../config/elasticsearch";
import logger from "../utils/logger";

export class HealthService {
    async checkHealth(): Promise<{
        status: "healthy" | "unhealthy";
        services: {
            postgres: "up" | "down";
            elasticsearch: "up" | "down";
        };
        error?: string;
    }> {
        const postgresStatus = await this.checkPostgres();
        const elasticsearchStatus = await this.checkElasticsearch();

        const allUp = postgresStatus === "up" && elasticsearchStatus === "up";
        const error = !allUp ? "One or more services are down" : undefined;

        return {
            status: allUp ? "healthy" : "unhealthy",
            services: {
                postgres: postgresStatus,
                elasticsearch: elasticsearchStatus,
            },
            error,
        };
    }

    private async checkPostgres(): Promise<"up" | "down"> {
        try {
            await sequelize.authenticate();
            return "up";
        } catch (error) {
            logger.error("PostgreSQL health check failed:", error);
            return "down";
        }
    }

    private async checkElasticsearch(): Promise<"up" | "down"> {
        try {
            await esClient.ping();
            return "up";
        } catch (error) {
            logger.error("Elasticsearch health check failed:", error);
            return "down";
        }
    }
}
