import express from "express";
import { getClinicSettings, updateClinicSettings } from "../controllers/settingsController.js";

const router = express.Router();

router.get("/clinic", getClinicSettings);
router.put("/clinic", updateClinicSettings);

export default router;
