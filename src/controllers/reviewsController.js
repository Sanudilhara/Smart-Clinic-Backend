import db from "../models/index.js";

const { Review } = db;

const parseInteger = (value) => {
  const parsed = Number(value);
  return Number.isInteger(parsed) ? parsed : undefined;
};

export const submitReview = async (req, res) => {
  try {
    const { patient_id, doctor_id, rating, comment } = req.body;

    if (!patient_id || !doctor_id || rating === undefined) {
      return res.status(400).json({
        success: false,
        message: "patient_id, doctor_id and rating are required",
      });
    }

    const parsedRating = parseInteger(rating);

    if (parsedRating === undefined || parsedRating < 1 || parsedRating > 5) {
      return res.status(400).json({
        success: false,
        message: "rating must be an integer between 1 and 5",
      });
    }

    const review = await Review.create({
      patient_id: Number(patient_id),
      doctor_id: Number(doctor_id),
      rating: parsedRating,
      comment: comment || null,
    });

    return res.status(201).json({
      success: true,
      message: "Review submitted successfully",
      review,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to submit review",
      details: error.message,
    });
  }
};

export const getDoctorReviews = async (req, res) => {
  try {
    const { doctor_id } = req.params;
    const reviews = await Review.findAll({
      where: { doctor_id: Number(doctor_id) },
      order: [["review_id", "DESC"]],
    });

    return res.json({
      success: true,
      count: reviews.length,
      reviews,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch doctor reviews",
      details: error.message,
    });
  }
};

export const deleteReview = async (req, res) => {
  try {
    const { review_id } = req.params;
    const review = await Review.findByPk(Number(review_id));

    if (!review) {
      return res.status(404).json({
        success: false,
        message: "Review not found",
      });
    }

    await review.destroy();

    return res.json({
      success: true,
      message: "Review deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to delete review",
      details: error.message,
    });
  }
};
