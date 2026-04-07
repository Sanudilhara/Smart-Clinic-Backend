import express from 'express';
import { createPatient, 
    getPatients, 
    getPatientById, 
    updatePatient, 
    deletePatient 
} from '../controllers/patientController.js'; 

const router = express.Router();

// Create patient route
router.post('/', createPatient);

// Get all patients route
router.get('/', getPatients);

// Get patient by ID route
router.get('/:id', getPatientById);

// Update patient route
router.put('/:id', updatePatient);

// Delete patient route
router.delete('/:id', deletePatient);

export default router; 
