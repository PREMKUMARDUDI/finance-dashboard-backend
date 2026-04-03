import express from "express";
import { getDashboardSummary } from "../controllers/summaryController.js";
import { protect } from "../middleware/authMiddleware.js";
import { authorizeRoles } from "../middleware/roleMiddleware.js";

const router = express.Router();

// Route: /api/summary
// Note: Viewers are included here so they can see the dashboard stats!
router.get(
  "/",
  protect,
  authorizeRoles("Admin", "Analyst", "Viewer"),
  getDashboardSummary,
);

export default router;
