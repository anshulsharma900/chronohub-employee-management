import express from "express";
import {
  applyLeave,
  getLeaves,
  updateLeaveStatus,
  cancelLeave,
  deleteLeave,
} from "../controllers/leaveController.js";

import protect from "../middleware/authMiddleware.js";
import authorizeRoles from "../middleware/roleMiddleware.js";

const router = express.Router();

// Employee apply leave
router.post("/", protect, authorizeRoles("employee"), applyLeave);

// Get leaves (role-based inside controller)
router.get("/", protect, getLeaves);

// Manager/Admin approve/reject
router.put("/:id", protect, authorizeRoles("manager", "admin"), updateLeaveStatus);

// Employee cancel own leave
router.put("/:id/cancel", protect, authorizeRoles("employee"), cancelLeave);

// Admin delete leave
router.delete("/:id", protect, authorizeRoles("admin"), deleteLeave);

export default router;
