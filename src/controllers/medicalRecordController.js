import db from "../models/index.js";
import { Op } from "sequelize";

const { MedicalRecord, Appointment } = db;

//helper function to parse integers and return undefined if invalid
const parseInteger = (value) => {
  const parsed = Number(value);
  return Number.isInteger(parsed) ? parsed : undefined;
};

export const getPatientRecords = async (req, res) => {
  try {
    const { patient_id } = req.params;
    const appointments = await db.Appointment.findAll({
      where: { patient_id: Number(patient_id) },
      attributes: ["appointment_id"],
    });

    const appointmentIds = appointments.map((appointment) => appointment.appointment_id);

    if (appointmentIds.length === 0) {
      return res.json({
        count: 0,
        records: [],
      });
    }

    const records = await MedicalRecord.findAll({
      where: { appointment_id: { [Op.in]: appointmentIds } },
      order: [["record_id", "ASC"]],
    });

    return res.json({
      count: records.length,
      records,
    });
  } catch (err) {
    return res.status(500).json({
      error: "Failed to fetch medical records",
      details: err.message,
    });
  }
};

export const getMedicalRecordById = async (req, res) => {
  try {
    const record = await MedicalRecord.findByPk(Number(req.params.record_id));

    if (!record) {
      return res.status(404).json({ error: "Medical record not found" });
    }

    return res.json(record);
  } catch (err) {
    return res.status(500).json({
      error: "Failed to fetch medical record",
      details: err.message,
    });
  }
};

export const createMedicalRecord = async (req, res) => {
  try {
    const { appointment_id, diagnosis, note, report } = req.body;

    if (!appointment_id) {
      return res.status(400).json({
        error: "appointment_id is required",
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

    const record = await MedicalRecord.create({
      appointment_id: parsedAppointmentId,
      diagnosis: diagnosis || null,
      note: note || null,
      report: report || null,
    });

    return res.status(201).json({
      message: "Medical record created successfully",
      record,
    });
  } catch (err) {
    return res.status(500).json({
      error: "Failed to create medical record",
      details: err.message,
    });
  }
};

export const updateMedicalRecord = async (req, res) => {
  try {
    const record = await MedicalRecord.findByPk(Number(req.params.record_id));

    if (!record) {
      return res.status(404).json({ error: "Medical record not found" });
    }

    const updates = {};
    const allowedFields = ["appointment_id", "diagnosis", "note", "report"];

    for (const field of allowedFields) {
      if (req.body[field] !== undefined) {
        if (field === "appointment_id") {
          const parsedAppointmentId = parseInteger(req.body[field]);

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

          updates[field] = parsedAppointmentId;
        } else {
          updates[field] = req.body[field];
        }
      }
    }

    await record.update(updates);
    return res.json({
      message: "Medical record updated successfully",
      record,
    });
  } catch (err) {
    return res.status(500).json({
      error: "Failed to update medical record",
      details: err.message,
    });
  }
};

export const deleteMedicalRecord = async (req, res) => {
  try {
    const record = await MedicalRecord.findByPk(Number(req.params.record_id));

    if (!record) {
      return res.status(404).json({ error: "Medical record not found" });
    }

    await record.destroy();
    return res.json({ message: "Medical record deleted successfully" });
  } catch (err) {
    return res.status(500).json({
      error: "Failed to delete medical record",
      details: err.message,
    });
  }
};

export const getMedicalRecordDetails = getMedicalRecordById;
