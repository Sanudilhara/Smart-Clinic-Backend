import db from "../models/index.js";
import { Op } from "sequelize"; // Import Sequelize operators for advanced querying

const { Payment, Appointment } = db;

const parseInteger = (value) => {
  const parsed = Number(value);
  return Number.isInteger(parsed) ? parsed : undefined;
};

export const createPayment = async (req, res) => {
  try {
    const {
      appointment_id,
      amount,
      payment_method,
      payment_status,
    } = req.body;

    if (!appointment_id || !amount || !payment_method) {
      return res.status(400).json({
        error: "appointment_id, amount and payment_method are required",
      });
    }

    const parsedAppointmentId = parseInteger(appointment_id);

    if (parsedAppointmentId === undefined) {
      return res.status(400).json({
        error: "appointment_id must be a valid integer",
      });
    }

    const appointment = await Appointment.findByPk(parsedAppointmentId);

    if (!appointment) {
      return res.status(400).json({
        error: "appointment_id does not exist",
      });
    }

    const payment = await Payment.create({
      appointment_id: parsedAppointmentId,
      amount,
      payment_method,
      payment_status: payment_status || "pending",
    });

    return res.status(201).json({
      message: "Payment created successfully",
      payment,
    });
  } catch (err) {
    return res.status(500).json({
      error: "Failed to create payment",
      details: err.message,
    });
  }
};

export const getPaymentHistory = async (req, res) => {
  try {
    const { patient_id } = req.params;
    const appointments = await Appointment.findAll({
      where: { patient_id: Number(patient_id) },
      attributes: ["appointment_id"],
    });

    const appointmentIds = appointments.map((appointment) => appointment.appointment_id);

    if (appointmentIds.length === 0) {
      return res.json({
        count: 0,
        payments: [],
      });
    }

    const payments = await Payment.findAll({
      where: { appointment_id: { [Op.in]: appointmentIds } },
      order: [["payment_id", "DESC"]],
    });

    return res.json({
      count: payments.length,
      payments,
    });
  } catch (err) {
    return res.status(500).json({
      error: "Failed to fetch payment history",
      details: err.message,
    });
  }
};

export const getPaymentDetails = async (req, res) => {
  try {
    const { payment_id } = req.params;

    const payment = await Payment.findByPk(Number(payment_id));

    if (!payment) {
      return res.status(404).json({
        error: "Payment not found",
      });
    }

    return res.json({ payment });
  } catch (err) {
    return res.status(500).json({
      error: "Failed to fetch payment details",
      details: err.message,
    });
  }
};

export const updatePaymentStatus = async (req, res) => {
  try {
    const { payment_id } = req.params;
    const { payment_status } = req.body;

    const payment = await Payment.findByPk(Number(payment_id));

    if (!payment) {
      return res.status(404).json({
        error: "Payment not found",
      });
    }

    if (!payment_status) {
      return res.status(400).json({
        error: "payment_status is required",
      });
    }

    await payment.update({ payment_status });

    return res.json({
      message: "Payment status updated successfully",
      payment,
    });
  } catch (err) {
    return res.status(500).json({
      error: "Failed to update payment status",
      details: err.message,
    });
  }
};
