import express from 'express';
import {
  createSchedule,
  getDoctorSchedule,
  updateSchedule,
  deleteSchedule
} from '../controllers/schedulesController.js';

const router = express.Router();

// Create schedule
router.post('/', createSchedule);

// View doctor's schedule
router.get('/doctor/:doctor_id', getDoctorSchedule);

// Update schedule
router.put('/:schedule_id', updateSchedule);

// Delete schedule
router.delete('/:schedule_id', deleteSchedule);

export default router;