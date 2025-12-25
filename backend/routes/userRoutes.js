import express from 'express';
import { createUser, getUsers, deleteAllUsers } from '../controllers/userController.js';

const router = express.Router();

router.post('/', createUser);
router.get('/', getUsers);
router.delete('/all', deleteAllUsers); // DELETE endpoint for testing

export default router;