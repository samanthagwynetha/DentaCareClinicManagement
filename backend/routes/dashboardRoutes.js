import express from 'express';
import Patient from '../src/models/Patient.js';
import Appointment from "../src/models/Appointment.js";
import Invoice from "../src/models/Invoice.js";
import { protect } from "../middlewares/authMiddleware.js";
import { authorize } from "../middlewares/roleMiddleware.js";
const router = express.Router();

router.get("/stats", protect, async (req, res) => {
    try {
        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const startOfNextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);
        const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);

        const startOfDay = new Date(now);
        startOfDay.setHours(0, 0, 0, 0);
        const endOfDay = new Date(now);
        endOfDay.setHours(23, 59, 59, 999);

        const startOfWeek = new Date(now);
        const dayOfWeek = startOfWeek.getDay();
        const mondayOffset = (dayOfWeek + 6) % 7;
        startOfWeek.setDate(startOfWeek.getDate() - mondayOffset);
        startOfWeek.setHours(0, 0, 0, 0);

        const startOfNextWeek = new Date(startOfWeek);
        startOfNextWeek.setDate(startOfNextWeek.getDate() + 7);

        const startOfLastWeek = new Date(startOfWeek);
        startOfLastWeek.setDate(startOfLastWeek.getDate() - 7);

        // Run independent database queries in parallel for speed
        const [
            totalPatients,
            patientsThisMonth,
            patientsLastMonth,
            todayAppointments,
            appointmentsRemaining,
            treatmentsDone,
            completedThisWeek,
            completedLastWeek
        ] = await Promise.all([
            Patient.countDocuments(),
            Patient.countDocuments({ createdAt: { $gte: startOfMonth, $lt: startOfNextMonth } }),
            Patient.countDocuments({ createdAt: { $gte: startOfLastMonth, $lt: startOfMonth } }),
            Appointment.countDocuments({ date: { $gte: startOfDay, $lte: endOfDay } }),
            Appointment.countDocuments({ date: { $gte: startOfDay, $lte: endOfDay }, status: { $nin: ["Completed", "Cancelled"] } }),
            Appointment.countDocuments({ status: "Completed" }),
            Appointment.countDocuments({ status: "Completed", date: { $gte: startOfWeek, $lt: startOfNextWeek } }),
            Appointment.countDocuments({ status: "Completed", date: { $gte: startOfLastWeek, $lt: startOfWeek } })
        ]);

        const patientsTrendPercent = patientsLastMonth === 0 
            ? (patientsThisMonth > 0 ? 100 : 0) 
            : ((patientsThisMonth - patientsLastMonth) / patientsLastMonth) * 100;

        let monthlyRevenue = 0;
        let revenueTrendPercent = 0;
        if (req.user && req.user.role === 'admin') {
            const [invoices, lastMonthInvoices] = await Promise.all([
                Invoice.find({
                    status: "paid",
                    issuedDate: { $gte: startOfMonth, $lt: startOfNextMonth },
                }).select("totalAmount"),
                Invoice.find({
                    status: "paid",
                    issuedDate: { $gte: startOfLastMonth, $lt: startOfMonth },
                }).select("totalAmount")
            ]);

            monthlyRevenue = invoices.reduce((sum, inv) => sum + (inv.totalAmount || 0), 0);
            const lastMonthRevenue = lastMonthInvoices.reduce((sum, inv) => sum + (inv.totalAmount || 0), 0);
            
            revenueTrendPercent = lastMonthRevenue === 0
                ? (monthlyRevenue > 0 ? 100 : 0)
                : ((monthlyRevenue - lastMonthRevenue) / lastMonthRevenue) * 100;
        }

        let treatmentsTrendPercent = completedLastWeek === 0
            ? (completedThisWeek > 0 ? 100 : 0)
            : ((completedThisWeek - completedLastWeek) / completedLastWeek) * 100;

        res.json({
            totalPatients,
            todayAppointments,
            monthlyRevenue,
            treatmentsDone,
            treatmentsTrendPercent,
            patientsTrendPercent,
            appointmentsRemaining,
            revenueTrendPercent,
        });
    } catch (err) {
        console.error("Dashboard stats error:", err);
        res.status(500).json({ message: "Dashboard stats error" });
    }
});

router.get("/revenue-monthly", protect, authorize("admin"), async (req, res) => {
    try {
        const now = new Date();
        const startOfYear = new Date(now.getFullYear(), 0, 1);
        const startOfNextYear = new Date(now.getFullYear() + 1, 0, 1);

        const rows = await Invoice.aggregate([
            {
                $match: {
                    status: "paid",
                    issuedDate: { $gte: startOfYear, $lt: startOfNextYear },
                },
            },
            {
                $group: {
                    _id: { $month: "$issuedDate" },
                    total: { $sum: "$totalAmount" },
                },
            },
        ]);

        const revenueData = Array(12).fill(0);
        rows.forEach((row) => {
            revenueData[row._id - 1] = row.total;
        });

        res.json({
            year: now.getFullYear(),
            months: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
            revenueData,
        });
    } catch (err) {
        res.status(500).json({ message: "Revenue monthly error" });
    }
});

router.get("/today-appointments", protect, async (req, res) => {
    try {
        const start = new Date();
        start.setHours(0, 0, 0, 0);
        const end = new Date();
        end.setHours(23, 59, 59, 999);

        const appointments = await Appointment.find({
            date: { $gte: start, $lte: end },
        })
            .populate("patient", "firstName lastName")
            .sort({ date: 1, time: 1 })
            .limit(8);

        const data = appointments.map((a) => {
            let status = "Pending";
            if (a.status === "Completed") status = "Completed";
            if (a.status === "Scheduled") status = "Pending";
            if (a.status === "Cancelled") status = "Cancelled";

            return {
                id: a._id,
                patientName: a.patient
                    ? `${a.patient.firstName} ${a.patient.lastName}`
                    : "Unknown Patient",
                procedure: a.notes?.trim() || "Dental Appointment",
                time: a.time,
                duration: "30 min",
                status,
            };
        });

        res.json({
            dateLabel: start.toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
            }),
            appointments: data,
        });
    } catch (err) {
        res.status(500).json({ message: "Today appointments error" });
    }
});

router.get("/recent-patients", protect, async (req, res) => {
    try {
        const patients = await Patient.find({})
            .sort({ updatedAt: -1 })
            .limit(4)
            .select("firstName lastName phone email updatedAt");

        const now = new Date();

        // Run all patient lookups in parallel
        const data = await Promise.all(
            patients.map(async (patient) => {
                const [lastVisit, nextAppointment] = await Promise.all([
                    Appointment.findOne({
                        patient: patient._id,
                        date: { $lte: now },
                    })
                        .sort({ date: -1 })
                        .select("date"),
                    Appointment.findOne({
                        patient: patient._id,
                        date: { $gt: now },
                        status: { $ne: "Cancelled" },
                    })
                        .sort({ date: 1 })
                        .select("date")
                ]);

                return {
                    id: patient._id,
                    firstName: patient.firstName,
                    lastName: patient.lastName,
                    phone: patient.phone || "",
                    email: patient.email || "",
                    lastVisit: lastVisit?.date || null,
                    nextAppointment: nextAppointment?.date || null,
                };
            })
        );

        res.json({ patients: data });
    } catch (err) {
        console.error("Recent patients error:", err);
        res.status(500).json({ message: "Recent patients error" });
    }
});

export default router;