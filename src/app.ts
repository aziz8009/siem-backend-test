import express from "express";
import helmet from "helmet";
import cors from "cors";

import { loggerMiddleware } from "./middlewares/logger.middleware";
import { errorHandler } from "./middlewares/error.middleware";
import routes from "./routes";

const app = express();

app.use(helmet());
app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(loggerMiddleware);

app.use(routes);

app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: `Route ${req.originalUrl} not found`,
    });
});

app.use(errorHandler);

export default app;
