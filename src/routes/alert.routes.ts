import { Router } from "express";
import { AlertController } from "../controllers/alert.controller";
import { AlertService } from "../services/alert.service";
import { AlertRepository } from "../repositories/alert.repository";
import { AssetRepository } from "../repositories/asset.repository";
import { validate } from "../middlewares/validate.middleware";
import { alertFilterSchema } from "../validators";

const router = Router();

// Initialize dependencies
const alertRepository = new AlertRepository();
const assetRepository = new AssetRepository();
const alertService = new AlertService(alertRepository, assetRepository);
const alertController = new AlertController(alertService);

// Route: GET /api/alerts
router.get("/", validate(alertFilterSchema), alertController.getFilteredAlerts);

export default router;
