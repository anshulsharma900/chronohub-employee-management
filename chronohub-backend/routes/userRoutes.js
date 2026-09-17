import express from "express";
import multer from "multer";
import {
  getUsers,
  updateUserRole,
  deleteUser,
  updateMyProfile,
} from "../controllers/userController.js";

import protect from "../middleware/authMiddleware.js";
import authorizeRoles from "../middleware/roleMiddleware.js";

const router = express.Router();

// Configure multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Get all users - Admin only
router.get("/", protect, authorizeRoles("admin"), getUsers);

// Update user role - Admin only
router.put("/:id", protect, authorizeRoles("admin"), updateUserRole);

// Delete user - Admin only
router.delete("/:id", protect, authorizeRoles("admin"), deleteUser);

// Update own profile - All authenticated users
router.put("/profile/update", protect, upload.single("profileImage"), updateMyProfile);

export default router;
