import express from "express";
import { protect } from "../middlewares/authMiddleware.js";
import {
	getProfile,
	updateProfile,
	changePassword,
	getNotificationPreferences,
	updateNotificationPreferences,
	getSystemPreferences,
	updateSystemPreferences,
} from "../controllers/accountController.js";

const router = express.Router();

router.get("/me", protect, getProfile);
router.put("/me", protect, updateProfile);
router.put("/me/password", protect, changePassword);
router.get("/me/notifications", protect, getNotificationPreferences);
router.put("/me/notifications", protect, updateNotificationPreferences);
router.get("/me/preferences", protect, getSystemPreferences);
router.put("/me/preferences", protect, updateSystemPreferences);

export default router;
