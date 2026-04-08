import express from "express";
import { protect } from "../../middlewares/authMiddleware.js";
import {
  getNotifications,
  markAsRead,
  markAllAsRead,
  createNotification
} from "../controllers/notificationController.js";

const router = express.Router();

router.route("/")
  .get(protect, getNotifications)
  .post(protect, createNotification);

router.put("/read-all", protect, markAllAsRead);
router.put("/:id/read", protect, markAsRead);

export default router;
