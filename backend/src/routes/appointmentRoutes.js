import express from 'express';
import {
    createAppointment,
    getAppointments,
    getAppointmentById,
    updateAppointment,
    deleteAppointment,
} from '../controllers/appointmentController.js';
import { protect } from '../../middlewares/authMiddleware.js';
import { authorize } from '../../middlewares/roleMiddleware.js';

const router = express.Router();

// routes - Dentist, Receptionist, and Admin can manage appointments
router.post('/', protect, authorize('dentist', 'receptionist', 'admin'), createAppointment);
router.get('/', protect, authorize('dentist', 'receptionist', 'admin'), getAppointments);
router.get('/:id', protect, authorize('dentist', 'receptionist', 'admin'), getAppointmentById);
router.put('/:id', protect, authorize('dentist', 'receptionist', 'admin'), updateAppointment);
router.delete('/:id', protect, authorize('dentist', 'admin'), deleteAppointment);

export default router;