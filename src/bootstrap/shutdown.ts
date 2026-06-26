import { sequelize } from "../config/database";
import logger from "../utils/logger";

export function registerShutdownHooks() {
    process.on("SIGTERM", async () => {
        logger.info("SIGTERM received");

        await sequelize.close();

        process.exit(0);
    });

    process.on("SIGINT", async () => {
        logger.info("SIGINT received");

        await sequelize.close();

        process.exit(0);
    });

    process.on("uncaughtException", (err) => {
        logger.error(err);
        process.exit(1);
    });

    process.on("unhandledRejection", (err) => {
        logger.error(err);
        process.exit(1);
    });
}
