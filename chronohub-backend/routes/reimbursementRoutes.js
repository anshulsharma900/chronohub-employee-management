import express from "express";
import {
  submitClaim,
  getClaims,
  getClaimById,
  reviewClaim,
  markAsPaid,
  cancelClaim,
  deleteClaim,
  getReimbursementStats,
} from "../controllers/reimbursementController.js";

import protect from "../middleware/authMiddleware.js";
import authorizeRoles from "../middleware/roleMiddleware.js";

const router = express.Router();

// Get stats (role-based inside controller)
router.get("/stats", protect, getReimbursementStats);

// Employee submit claim
router.post("/", protect, authorizeRoles("employee"), submitClaim);

// Get claims (role-based inside controller)
router.get("/", protect, getClaims);

// Get single claim by ID
router.get("/:id", protect, getClaimById);

// Manager/Admin approve/reject claim
router.put("/:id/review", protect, authorizeRoles("manager", "admin"), reviewClaim);

// Admin mark claim as paid
router.put("/:id/pay", protect, authorizeRoles("admin"), markAsPaid);

// Employee cancel own claim
router.delete("/:id/cancel", protect, authorizeRoles("employee"), cancelClaim);

// Admin delete claim
router.delete("/:id", protect, authorizeRoles("admin"), deleteClaim);

export default router;
