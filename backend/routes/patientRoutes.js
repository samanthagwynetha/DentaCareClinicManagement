import express from "express";
import { verifyToken } from "../controllers/patientController.js";
import { authorize } from "../middlewares/roleMiddleware.js";

const router = express.Router();

// all roles can view patients
router.get(
    "/",
    verifyToken,
    authorize("dentist", "dentist", "receptionist"),
    getPatients
);

// dentist & receptionist create patient 
router.post(
    "/",
    verifyToken,
    authorize("receptionist", "admin"),
    createPatient
);

// admin only, delete patient 
roouter.delete(
    "/:id",
    verifyToken,
    authorize("admin"),
    deletePatient
);

export default router;