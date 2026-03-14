import express from 'express';
import {
	createUser,
	getUsers,
	deleteAllUsers,
	getDentists,
	updateUser,
	deleteUser,
	resetUserPassword,
} from '../controllers/userController.js';
import { protect } from '../middlewares/authMiddleware.js';
import { authorize } from '../middlewares/roleMiddleware.js';

const router = express.Router();

// All authenticated users can fetch dentists
router.get('/dentists', protect, getDentists);

//Testing
// router.post('/', createUser);

// Admin only routes
router.post('/', protect, authorize('admin'), createUser);
router.get('/', protect, authorize('admin'), getUsers);
router.put('/:id', protect, authorize('admin'), updateUser);
router.delete('/:id', protect, authorize('admin'), deleteUser);
router.put('/:id/reset-password', protect, authorize('admin'), resetUserPassword);
router.delete('/all', protect, authorize('admin'), deleteAllUsers); // endpoint for testing

export default router;