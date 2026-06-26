import { Router } from "express";
import { HighlightedIPController } from "../controllers/highlighted-ip.controller";
import { HighlightedIPService } from "../services/highlighted-ip.service";
import { HighlightedIPRepository } from "../repositories/highlighted-ip.repository";
import { AlertRepository } from "../repositories/alert.repository";
import { validate } from "../middlewares/validate.middleware";
import { createHighlightedIPSchema, updateHighlightedIPSchema } from "../validators";

const router = Router();

// Initialize dependencies
const highlightedIPRepository = new HighlightedIPRepository();
const alertRepository = new AlertRepository();
const highlightedIPService = new HighlightedIPService(highlightedIPRepository, alertRepository);
const highlightedIPController = new HighlightedIPController(highlightedIPService);

// Routes
router.post("/", validate(createHighlightedIPSchema), highlightedIPController.createHighlightedIP);

router.get("/", highlightedIPController.getAllHighlightedIPs);

router.get("/activity", highlightedIPController.getActivityByHighlightedIPs);

router.get("/:id", highlightedIPController.getHighlightedIPById);

router.put("/:id", validate(updateHighlightedIPSchema), highlightedIPController.updateHighlightedIP);

router.delete("/:id", highlightedIPController.deleteHighlightedIP);

export default router;
