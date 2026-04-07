import express from 'express';
import { createRoom, 
    getRooms, 
    getRoomById, 
    updateRoom, 
    deleteRoom 
} from '../controllers/roomsController.js';

const router = express.Router();

// Create room route
router.post("/", createRoom);

// Get all rooms route
router.get("/", getRooms);

// Get room by ID route
router.get('/:room_id', getRoomById);

// Update room route
router.put('/:room_id', updateRoom);

// Delete room route
router.delete('/:room_id', deleteRoom);

export default router;