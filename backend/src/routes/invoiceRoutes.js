import express from 'express';

import {
    createInvoice,
    getInvoices,
    getInvoiceById,
    updateInvoice,
    deleteInvoice,
} from '../controllers/invoiceController.js';
import { protect } from '../../middlewares/authMiddleware.js';
import { authorize } from '../../middlewares/roleMiddleware.js';

const router = express.Router();

//routes - Receptionist and Admin can manage invoices
router.post('/', protect, authorize('receptionist', 'admin'), createInvoice);
router.get('/', protect, authorize('dentist', 'receptionist', 'admin'), getInvoices);
router.get('/:id', protect, authorize('dentist', 'receptionist', 'admin'), getInvoiceById);
router.put('/:id', protect, authorize('receptionist', 'admin'), updateInvoice);
router.delete('/:id', protect, authorize('admin'), deleteInvoice);

export default router;