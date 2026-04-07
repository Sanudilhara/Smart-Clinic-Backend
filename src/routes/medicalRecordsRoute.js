import express from 'express';
import { createMedicalRecord, 
    getPatientRecords, 
    getMedicalRecordDetails, 
    updateMedicalRecord, 
    deleteMedicalRecord 
} from '../controllers/medicalRecordController.js';  

const router = express.Router();

// Create medical record route
router.post('/', createMedicalRecord);   

// Get patient records route    
router.get('/patient/:patient_id', getPatientRecords);

// Get medical record details route
router.get('/:record_id', getMedicalRecordDetails);

// Update medical record route
router.put('/:record_id', updateMedicalRecord);

// Delete medical record route
router.delete('/:record_id', deleteMedicalRecord);

export default router;
