import express from 'express';
import { createPrescription, 
    getPrescriptionById, 
    getPrescriptionDetails, 
    updatePrescription, 
    deletePrescription 
} from '../controllers/prescriptionsController.js';

const router = express.Router();

// Create Prescription route
router.post('/', createPrescription);

// Get Prescription by ID route
router.get('/patient/:patient_id', getPrescriptionById);

// Get prescriptions details 
router.get('/:prescription_id', getPrescriptionDetails);

// Update Prescription route
router.put('/:prescription_id', updatePrescription);

// Delete Prescription route    
router.delete('/:prescription_id', deletePrescription);

export default router; 