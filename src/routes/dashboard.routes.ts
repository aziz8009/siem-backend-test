import { Router } from "express";
import { DashboardController } from "../controllers/dashboard.controller";
import { DashboardService } from "../services/dashboard.service";
import { AlertRepository } from "../repositories/alert.repository";
import { AssetRepository } from "../repositories/asset.repository";

const router = Router();

// Initialize dependencies
const alertRepository = new AlertRepository();
const assetRepository = new AssetRepository();
const dashboardService = new DashboardService(alertRepository, assetRepository);
const dashboardController = new DashboardController(dashboardService);

// Route: GET /api/dashboard/top-targets
router.get("/top-targets", dashboardController.getTopTargetedAssets);

export default router;
