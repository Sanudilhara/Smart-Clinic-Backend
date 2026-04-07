import express from 'express';
import {
  submitReview,
  getDoctorReviews,
  deleteReview
} from '../controllers/reviewsController.js';

const router = express.Router();

// Submit review
router.post('/', submitReview);

// Get reviews by doctor
router.get('/doctor/:doctor_id', getDoctorReviews);

// Delete review
router.delete('/:review_id', deleteReview);

export default router;