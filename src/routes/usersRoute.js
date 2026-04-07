import express from 'express';
import { users, 
    getUserById, 
    updateUser, 
    deleteUser 
} from '../controllers/usersController.js';
import auth from '../middleware/auth.js';

const router = express.Router();

router.use(auth);

// Get all users route
router.get("/", users);

// Get user by ID route
router.get('/:user_id', getUserById);

// Update user route
router.put('/:user_id', updateUser);

// Delete user route
router.delete('/:user_id', deleteUser);

export default router;
