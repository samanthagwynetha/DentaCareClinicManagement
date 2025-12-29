import express from 'express';
import { createUser, getUsers, deleteAllUsers } from '../controllers/userController.js';
import { protect } from '../middlewares/authMiddleware.js';
import { authorize } from '../middlewares/roleMiddleware.js';

const router = express.Router();

//Testing
// router.post('/', createUser);

// Admin only routes
router.post('/', protect, authorize('admin'), createUser);
router.get('/', protect, authorize('admin'), getUsers);
router.delete('/all', protect, authorize('admin'), deleteAllUsers); // endpoint for testing

export default router;