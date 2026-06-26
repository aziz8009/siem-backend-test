import { initializeElasticsearch } from "../config/elasticsearch";

export async function bootstrapElasticsearch() {
    await initializeElasticsearch();
}
