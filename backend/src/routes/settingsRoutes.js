import express from "express";
import { getClinicSettings, updateClinicSettings } from "../controllers/settingsController.js";
import { protect } from "../../middlewares/authMiddleware.js";
import { authorize } from "../../middlewares/roleMiddleware.js";

const router = express.Router();

router.get("/clinic", protect, getClinicSettings);
router.put("/clinic", protect, authorize("admin"), updateClinicSettings);

export default router;
