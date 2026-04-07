// Import database models (Sequelize)
import db from "../models/index.js";

// Get Appointment model from db
const { Appointment, Patient, Doctor, Schedule } = db;

const parseInteger = (value) => {
  const parsed = Number(value);
  return Number.isInteger(parsed) ? parsed : undefined;
};

// CREATE APPOINTMENT
export const createAppointment = async (req, res) => {
  try {
    // Get data from request body
    const {
      patient_id,
      doctor_id,
      schedule_id,
      appointment_date,
      arrival_time,
      status,
      payment_state,
      note,
      fee,
    } = req.body;

    // Validate required fields
    if (!patient_id || !doctor_id || !schedule_id) {
      return res.status(400).json({
        error: "patient_id, doctor_id and schedule_id are required",
      });
    }
 
    // Validate that IDs are integers and exist in the database
    const parsedPatientId = parseInteger(patient_id);
    const parsedDoctorId = parseInteger(doctor_id);
    const parsedScheduleId = parseInteger(schedule_id);

    // Check if parsed IDs are valid integers
    if (
      parsedPatientId === undefined ||
      parsedDoctorId === undefined ||
      parsedScheduleId === undefined
    ) {
      return res.status(400).json({
        error: "patient_id, doctor_id and schedule_id must be valid integers",
      });
    }

    // Fetch related records in parallel to validate existence
    const [patient, doctor, schedule] = await Promise.all([
      Patient.findByPk(parsedPatientId),
      Doctor.findByPk(parsedDoctorId),
      Schedule.findByPk(parsedScheduleId),
    ]);

    // If any of the related records do not exist, return an error
    if (!patient || !doctor || !schedule) {
      return res.status(400).json({
        error: "patient_id, doctor_id or schedule_id does not exist",
      });
    }

    // Create new appointment in database
    const appointment = await Appointment.create({
      patient_id: parsedPatientId,
      doctor_id: parsedDoctorId,
      schedule_id: parsedScheduleId,

      // If arrival_time not provided, fallback to appointment_date
      arrival_time: arrival_time || appointment_date || null,

      // Default values
      status: status || "pending",
      payment_state: payment_state || "unpaid",

      note: note || null,
      fee: fee ?? 0, // if undefined → 0
    });

    // Success response
    return res.status(201).json({
      message: "Appointment created successfully",
      appointment,
    });

  } catch (err) {
    // Error handling
    return res.status(500).json({
      error: "Failed to create appointment",
      details: err.message,
    });
  }
};

// GET ALL APPOINTMENTS (WITH FILTERS)
export const getAllAppointments = async (req, res) => {
  try {
    // Get query parameters
    const { patient_id, doctor_id, status, payment_state } = req.query;

    // Create dynamic filter object
    const where = {};

    if (patient_id) where.patient_id = Number(patient_id);
    if (doctor_id) where.doctor_id = Number(doctor_id);
    if (status) where.status = status;
    if (payment_state) where.payment_state = payment_state;

    // Fetch data from DB
    const appointments = await Appointment.findAll({
      where,
      order: [["created_at", "DESC"]], // latest first
    });

    return res.json({
      count: appointments.length,
      appointments,
    });

  } catch (err) {
    return res.status(500).json({
      error: "Failed to fetch appointments",
      details: err.message,
    });
  }
};

// GET APPOINTMENT BY ID
export const getAppointmentById = async (req, res) => {
  try {
    const { appointment_id } = req.params;

    // Find by primary key
    const appointment = await Appointment.findByPk(Number(appointment_id));

    // If not found
    if (!appointment) {
      return res.status(404).json({
        error: "Appointment not found",
      });
    }

    return res.json({ appointment });

  } catch (err) {
    return res.status(500).json({
      error: "Failed to fetch appointment",
      details: err.message,
    });
  }
};

// GET APPOINTMENTS BY PATIENT
export const getPatientAppointments = async (req, res) => {
  try {
    const { patient_id } = req.params;

    const appointments = await Appointment.findAll({
      where: { patient_id: Number(patient_id) },
      order: [["created_at", "DESC"]],
    });

    return res.json({
      count: appointments.length,
      appointments,
    });

  } catch (err) {
    return res.status(500).json({
      error: "Failed to fetch patient appointments",
      details: err.message,
    });
  }
};

// GET APPOINTMENTS BY DOCTOR
export const getDoctorAppointments = async (req, res) => {
  try {
    const { doctor_id } = req.params;

    const appointments = await Appointment.findAll({
      where: { doctor_id: Number(doctor_id) },
      order: [["created_at", "DESC"]],
    });

    return res.json({
      count: appointments.length,
      appointments,
    });

  } catch (err) {
    return res.status(500).json({
      error: "Failed to fetch doctor appointments",
      details: err.message,
    });
  }
};

// UPDATE APPOINTMENT (PARTIAL UPDATE)
export const updateAppointmentStatus = async (req, res) => {
  try {
    const { appointment_id } = req.params;
    const { status, payment_state, note, fee } = req.body;

    // Find appointment
    const appointment = await Appointment.findByPk(Number(appointment_id));

    if (!appointment) {
      return res.status(404).json({
        error: "Appointment not found",
      });
    }

    // Only update provided fields
    const updates = {};

    if (status !== undefined) updates.status = status;
    if (payment_state !== undefined) updates.payment_state = payment_state;
    if (note !== undefined) updates.note = note;
    if (fee !== undefined) updates.fee = fee;

    // Update DB
    await appointment.update(updates);

    return res.json({
      message: "Appointment updated successfully",
      appointment,
    });

  } catch (err) {
    return res.status(500).json({
      error: "Failed to update appointment",
      details: err.message,
    });
  }
};

// CANCEL APPOINTMENT (SOFT CANCEL)
export const cancelAppointment = async (req, res) => {
  try {
    const { appointment_id } = req.params;

    // Find appointment
    const appointment = await Appointment.findByPk(Number(appointment_id));

    if (!appointment) {
      return res.status(404).json({
        error: "Appointment not found",
      });
    }

    // Instead of deleting → update status
    await appointment.update({
      status: "canceled",
    });

    return res.json({
      message: "Appointment canceled successfully",
      appointment,
    });

  } catch (err) {
    return res.status(500).json({
      error: "Failed to cancel appointment",
      details: err.message,
    });
  }
};
