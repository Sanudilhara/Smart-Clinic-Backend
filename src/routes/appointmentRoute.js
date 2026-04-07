import express from "express"; // Import Express framework

// Import appointment controller functions to handle appointment-related operations
import {
createAppointment,
  getAllAppointments,
  getAppointmentById,
  getPatientAppointments,
  getDoctorAppointments,
  updateAppointmentStatus,
  cancelAppointment,
} from "../controllers/appointmentController.js";

// Create a new router instance for handling appointment routes
const router = express.Router();

// Create appointment route
router.post("/", createAppointment);

// Get appointments routes
router.get("/", getAllAppointments);

// Get appointments for a specific patient route
router.get("/patient/:patient_id", getPatientAppointments);

// Get appointments for a specific doctor route
router.get("/doctor/:doctor_id", getDoctorAppointments);

// Get appointment by ID route
router.get("/:appointment_id", getAppointmentById);

// Update appointment status route
router.put("/:appointment_id/status", updateAppointmentStatus);

// Cancel appointment route
router.delete("/:appointment_id", cancelAppointment);

export default router;
