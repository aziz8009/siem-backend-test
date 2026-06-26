import { sequelize, initializeDatabase } from "../config/database";
import { env } from "../config/environment";
import logger from "../utils/logger";

export async function bootstrapDatabase() {
    await initializeDatabase();

    if (env.nodeEnv === "development") {
        await sequelize.sync({ alter: true });
        logger.info("Database synchronized");
    }
}
