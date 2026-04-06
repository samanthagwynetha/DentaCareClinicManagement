import express from "express";
import { sendReminder } from "../controllers/reminderController.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

// POST /api/reminders/send
router.post("/send", protect, sendReminder);

export default router;
