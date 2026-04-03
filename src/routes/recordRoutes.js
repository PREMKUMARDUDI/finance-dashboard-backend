import express from "express";
import {
  createRecord,
  getRecords,
  getRecordById,
  updateRecord,
  deleteRecord,
} from "../controllers/recordController.js";
import { protect } from "../middleware/authMiddleware.js";
import { authorizeRoles } from "../middleware/roleMiddleware.js";

const router = express.Router();

// Apply 'protect' middleware to all routes in this file
router.use(protect);

// Route: /api/records
router
  .route("/")
  .post(authorizeRoles("Admin"), createRecord) // Only Admins can create
  .get(authorizeRoles("Admin", "Analyst"), getRecords); // Admins and Analysts can view list

// Route: /api/records/:id
router
  .route("/:id")
  .get(authorizeRoles("Admin", "Analyst"), getRecordById)
  .put(authorizeRoles("Admin"), updateRecord)
  .delete(authorizeRoles("Admin"), deleteRecord);

export default router;
