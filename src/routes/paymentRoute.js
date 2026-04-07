import express from 'express';
import { createPayment, 
    getPaymentHistory, 
    getPaymentDetails, 
    updatePaymentStatus 
} from '../controllers/paymentsController.js';   

const router = express.Router();

// Create payment entry route
router.post('/', createPayment);

// Get payment history route    
router.get('/patient/:patient_id', getPaymentHistory);

// Get payment details route
router.get('/:payment_id', getPaymentDetails);

// Update payment status route
router.put('/:payment_id/status', updatePaymentStatus);

export default router;
