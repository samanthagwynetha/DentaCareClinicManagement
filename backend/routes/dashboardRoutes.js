import express from 'express';
import Patient from '../src/models/Patient.js';
import Appointment from "../src/models/Appointment.js";
import Invoice from "../src/models/Invoice.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/stats", protect, async (req, res) => {
    try {
        const totalPatients = await Patient.countDocuments();

        const  today = new Date().toISOString().split('T')[0];
        const totalAppointmentsToday = await Appointment.countDocuments({
            date: today,
        });

        const invoices = await Invoice.find({});
        const monthlyRevenue = invoices.reduce(
            (sum, inv) => sum + (inv.amount || 0),
            0
        );

        res.json({
            totalPatients,
            totalAppointmentsToday,
            monthlyRevenue,
        });
    } catch (err) {
        res.status(500).json({ message: "Dashboard stats error " });
    }
});

export default router;