import db from "../models/index.js";
import { Op } from "sequelize";

const { Prescription, Appointment } = db;

const parseInteger = (value) => {
  const parsed = Number(value);
  return Number.isInteger(parsed) ? parsed : undefined;
};

export const createPrescription = async (req, res) => {
  try {
    const { appointment_id, medicine_name, instruction, title, additional_note } =
      req.body;

    if (!appointment_id || !medicine_name) {
      return res.status(400).json({
        success: false,
        message: "appointment_id and medicine_name are required",
      });
    }

    const parsedAppointmentId = parseInteger(appointment_id);

    if (parsedAppointmentId === undefined) {
      return res.status(400).json({
        success: false,
        message: "appointment_id must be a valid integer",
      });
    }

    const appointment = await Appointment.findByPk(parsedAppointmentId);

    if (!appointment) {
      return res.status(400).json({
        success: false,
        message: "appointment_id does not exist",
      });
    }

    const prescription = await Prescription.create({
      appointment_id: parsedAppointmentId,
      medicine_name,
      instruction: instruction || null,
      title: title || null,
      additional_note: additional_note || null,
    });

    return res.status(201).json({
      success: true,
      message: "Prescription created successfully",
      prescription,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to create prescription",
      details: error.message,
    });
  }
};

export const getPrescriptionById = async (req, res) => {
  try {
    const { patient_id } = req.params;
    const appointments = await Appointment.findAll({
      where: { patient_id: Number(patient_id) },
      attributes: ["appointment_id"],
    });

    const appointmentIds = appointments.map((appointment) => appointment.appointment_id);

    if (appointmentIds.length === 0) {
      return res.json({
        success: true,
        count: 0,
        prescriptions: [],
      });
    }

    const prescriptions = await Prescription.findAll({
      where: { appointment_id: { [Op.in]: appointmentIds } },
      order: [["prescription_id", "DESC"]],
    });

    return res.json({
      success: true,
      count: prescriptions.length,
      prescriptions,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch prescriptions",
      details: error.message,
    });
  }
};

export const getPrescriptionDetails = async (req, res) => {
  try {
    const prescription = await Prescription.findByPk(
      Number(req.params.prescription_id)
    );

    if (!prescription) {
      return res.status(404).json({
        success: false,
        message: "Prescription not found",
      });
    }

    return res.json({
      success: true,
      prescription,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch prescription",
      details: error.message,
    });
  }
};

export const updatePrescription = async (req, res) => {
  try {
    const prescription = await Prescription.findByPk(
      Number(req.params.prescription_id)
    );

    if (!prescription) {
      return res.status(404).json({
        success: false,
        message: "Prescription not found",
      });
    }

    const updates = {};
    const fields = [
      "appointment_id",
      "medicine_name",
      "instruction",
      "title",
      "additional_note",
    ];

    for (const field of fields) {
      if (req.body[field] !== undefined) {
        if (field === "appointment_id") {
          const parsedAppointmentId = parseInteger(req.body[field]);

          if (parsedAppointmentId === undefined) {
            return res.status(400).json({
              success: false,
              message: "appointment_id must be a valid integer",
            });
          }

          const appointment = await Appointment.findByPk(parsedAppointmentId);
          if (!appointment) {
            return res.status(400).json({
              success: false,
              message: "appointment_id does not exist",
            });
          }

          updates[field] = parsedAppointmentId;
        } else {
          updates[field] = req.body[field];
        }
      }
    }

    await prescription.update(updates);

    return res.json({
      success: true,
      message: "Prescription updated successfully",
      prescription,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to update prescription",
      details: error.message,
    });
  }
};

export const deletePrescription = async (req, res) => {
  try {
    const prescription = await Prescription.findByPk(
      Number(req.params.prescription_id)
    );

    if (!prescription) {
      return res.status(404).json({
        success: false,
        message: "Prescription not found",
      });
    }

    await prescription.destroy();

    return res.json({
      success: true,
      message: "Prescription deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to delete prescription",
      details: error.message,
    });
  }
};
