import express from 'express';
import {
    createPatient,
    getAllPatients,
    getPatientById,
    updatePatient,
    deletePatient
} from '../controllers/patientController.js';
import { protect } from '../../middlewares/authMiddleware.js';
import { authorize } from '../../middlewares/roleMiddleware.js';

const router = express.Router();

// routes - Receptionist can create, all roles can view
router.post('/', protect, authorize('receptionist', 'admin'), createPatient);
router.get('/', protect, authorize('dentist', 'receptionist', 'admin'), getAllPatients);
router.get('/:id', protect, authorize('dentist', 'receptionist', 'admin'), getPatientById);
router.put('/:id', protect, authorize('receptionist', 'admin'), updatePatient);
router.delete('/:id', protect, authorize('admin'), deletePatient);

export default router;