import { Router } from "express";
import { HealthController } from "../controllers/health.controller";
import { HealthService } from "../services/health.service";

const router = Router();

// Initialize dependencies
const healthService = new HealthService();
const healthController = new HealthController(healthService);

// Route: GET /api/health
router.get("/", healthController.checkHealth);

export default router;
