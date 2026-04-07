import express from 'express';
import { createNotification, 
    getUserNotifications, 
    markAsRead 
} from '../controllers/notificationsController.js';   

const router = express.Router();

// Create/send notification route
router.post('/', createNotification);

// Get user notifications route
router.get('/user/:user_id', getUserNotifications);

// Mark notification as read route
router.put('/:notification_id/read', markAsRead);

export default router;