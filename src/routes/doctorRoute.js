import express from 'express';
import { createDoctor, 
    listDoctors, 
    getDoctorById, 
    listDoctorsByDepartment, 
    updateDoctor, 
    deleteDoctor 
} from '../controllers/doctorsController.js';
import {authenticate} from "../middleware/auth.js"

const router = express.Router();

// Create doctor route
router.post("/", authenticate, createDoctor);

// List all doctors route
router.get("/", listDoctors);

//List doctors by department route
router.get('/department/:department_id', listDoctorsByDepartment);

// Get doctor by ID route
router.get('/:doctor_id', getDoctorById);

// Update doctor route      
router.put('/:doctor_id', updateDoctor);

// Delete doctor route      
router.delete('/:doctor_id', deleteDoctor);

export default router;
