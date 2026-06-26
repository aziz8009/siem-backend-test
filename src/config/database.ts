import { Sequelize } from "sequelize";
import { env } from "./environment";
import logger from "../utils/logger";

export const sequelize = new Sequelize({
    dialect: "postgres",
    host: env.db.host,
    port: env.db.port,
    username: env.db.user,
    password: env.db.password,
    database: env.db.database,
    pool: {
        min: env.db.poolMin,
        max: env.db.poolMax,
        acquire: 30000,
        idle: 10000,
    },
    logging: (msg) => logger.debug(msg),
    define: {
        timestamps: true,
        underscored: true,
    },
});

export const initializeDatabase = async (): Promise<void> => {
    try {
        await sequelize.authenticate();
        logger.info("PostgreSQL connection successfully");
    } catch (error) {
        logger.error("Unable to connect to PostgreSQL:", error);
        throw error;
    }
};
