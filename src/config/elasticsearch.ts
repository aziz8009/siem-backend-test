import { Client } from "@elastic/elasticsearch";
import { env } from "./environment";
import logger from "../utils/logger";

export const esClient = new Client({
    node: env.elasticsearch.url,
    requestTimeout: env.elasticsearch.timeout,
    maxRetries: 3,
    sniffOnStart: false,
});

export const initializeElasticsearch = async (): Promise<void> => {
    try {
        const health = await esClient.cluster.health();
        logger.info("Elasticsearch connection successfully");
        logger.debug("Elasticsearch health:", health);
    } catch (error) {
        logger.error("Unable to connect to Elasticsearch:", error);
        throw error;
    }
};
