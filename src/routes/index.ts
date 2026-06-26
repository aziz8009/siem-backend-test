import { Router } from "express";

import alertRoutes from "./alert.routes";
import dashboardRoutes from "./dashboard.routes";
import highlightedIPRoutes from "./highlighted-ip.routes";
import healthRoutes from "./health.routes";

const router = Router();

router.use("/api/alerts", alertRoutes);
router.use("/api/dashboard", dashboardRoutes);
router.use("/api/highlighted-ips", highlightedIPRoutes);
router.use("/api/health", healthRoutes);

router.get("/", (_, res) => {
    res.json({
        name: "SIEM Backend API",
        version: "1.0.0",
        status: "running",
    });
});

export default router;
