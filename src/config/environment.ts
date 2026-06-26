import dotenv from "dotenv";

dotenv.config();

export const env = {
    nodeEnv: process.env.NODE_ENV || "development",
    port: parseInt(process.env.PORT || "3000", 10),

    db: {
        host: process.env.DB_HOST || "localhost",
        port: parseInt(process.env.DB_PORT || "5432", 10),
        user: process.env.DB_USER || "backend_user",
        password: process.env.DB_PASSWORD || "secretpassword",
        database: process.env.DB_NAME || "siem_db",
        poolMin: parseInt(process.env.DB_POOL_MIN || "2", 10),
        poolMax: parseInt(process.env.DB_POOL_MAX || "10", 10),
    },

    elasticsearch: {
        url: process.env.ELASTICSEARCH_URL || "http://localhost:9200",
        index: process.env.ELASTICSEARCH_INDEX || "security-alerts",
        timeout: parseInt(process.env.ELASTICSEARCH_TIMEOUT || "30000", 10),
    },

    logLevel: process.env.LOG_LEVEL || "info",
};
