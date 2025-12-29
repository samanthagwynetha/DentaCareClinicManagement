import express from 'express';
import { protect } from '../middlewares/authMiddleware.js';
import { authorize } from '../middlewares/roleMiddleware.js';

const router = express.Router();

// Admin-only dashboard
router.get('/admin-dashboard', protect, authorize('admin'), (req, res) => {
    res.json({ message: "Welcome Admin!" });
});

// Admin-only stats (example)
router.get('/stats', protect, authorize('admin'), (req, res) => {
    res.json({ 
        message: "Admin statistics",
        totalUsers: 0,
        totalPatients: 0,
        totalAppointments: 0
    });
});

export default router;
