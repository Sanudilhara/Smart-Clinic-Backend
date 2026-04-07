import db from "../models/index.js";

const { Patient } = db;

export const createPatient = async (req, res) => {
  try {
    const { user_id, dob, address, gender } = req.body;

    if (!user_id) {
      return res.status(400).json({
        success: false,
        message: "user_id is required",
      });
    }

    const patient = await Patient.create({
      user_id: Number(user_id),
      dob: dob || null,
      address: address || null,
      gender: gender || null,
    });

    return res.status(201).json({
      success: true,
      message: "Patient created successfully",
      patient,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to create patient",
      details: error.message,
    });
  }
};

export const getPatients = async (req, res) => {
  try {
    const patients = await Patient.findAll({
      order: [["patient_id", "DESC"]],
    });

    return res.json({
      success: true,
      count: patients.length,
      patients,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch patients",
      details: error.message,
    });
  }
};

export const getPatientById = async (req, res) => {
  try {
    const patient = await Patient.findByPk(Number(req.params.id));

    if (!patient) {
      return res.status(404).json({
        success: false,
        message: "Patient not found",
      });
    }

    return res.json({
      success: true,
      patient,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch patient",
      details: error.message,
    });
  }
};

export const updatePatient = async (req, res) => {
  try {
    const patient = await Patient.findByPk(Number(req.params.id));

    if (!patient) {
      return res.status(404).json({
        success: false,
        message: "Patient not found",
      });
    }

    const updates = {};
    const fields = ["user_id", "dob", "address", "gender"];

    for (const field of fields) {
      if (req.body[field] !== undefined) {
        updates[field] = field === "user_id" ? Number(req.body[field]) : req.body[field];
      }
    }

    await patient.update(updates);

    return res.json({
      success: true,
      message: "Patient updated successfully",
      patient,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to update patient",
      details: error.message,
    });
  }
};

export const deletePatient = async (req, res) => {
  try {
    const patient = await Patient.findByPk(Number(req.params.id));

    if (!patient) {
      return res.status(404).json({
        success: false,
        message: "Patient not found",
      });
    }

    await patient.destroy();

    return res.json({
      success: true,
      message: "Patient deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to delete patient",
      details: error.message,
    });
  }
};
