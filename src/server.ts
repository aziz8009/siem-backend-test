import app from "./app";

import { env } from "./config/environment";

import { bootstrapDatabase } from "./bootstrap/database";
import { bootstrapElasticsearch } from "./bootstrap/elasticsearch";
import { registerShutdownHooks } from "./bootstrap/shutdown";

import logger from "./utils/logger";

async function bootstrap() {
    try {
        await Promise.all([bootstrapDatabase(), bootstrapElasticsearch()]);

        registerShutdownHooks();

        app.listen(env.port, () => {
            logger.info(`Server started on port ${env.port}`);
        });
    } catch (err) {
        logger.error("Failed to bootstrap application", err);
        process.exit(1);
    }
}

bootstrap();
