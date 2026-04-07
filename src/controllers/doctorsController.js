import db from "../models/index.js";

const { Doctor } = db;

export const createDoctor = async (req, res) => {
  try {
    const {
      user_id,
      department_id,
      doctor_name,
      doctor_fee,
      specialization,
      experience_year,
      bio,
    } = req.body;

    if (!user_id || !department_id || !doctor_name) {
      return res.status(400).json({
        success: false,
        message: "user_id, department_id and doctor_name are required",
      });
    }

    const doctor = await Doctor.create({
      user_id: Number(user_id),
      department_id: Number(department_id),
      doctor_name,
      doctor_fee: doctor_fee ?? 0,
      specialization: specialization || null,
      experience_year: experience_year ?? 0,
      bio: bio || null,
    });

    return res.status(201).json({
      success: true,
      message: "Doctor created successfully",
      doctor,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to create doctor",
      details: error.message,
    });
  }
};

export const listDoctors = async (req, res) => {
  try {
    const doctors = await Doctor.findAll({
      order: [["doctor_id", "DESC"]],
    });

    return res.json({
      success: true,
      count: doctors.length,
      doctors,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch doctors",
      details: error.message,
    });
  }
};

export const getDoctorById = async (req, res) => {
  try {
    const { doctor_id } = req.params;
    const doctor = await Doctor.findByPk(Number(doctor_id));

    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: "Doctor not found",
      });
    }

    return res.json({
      success: true,
      doctor,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch doctor",
      details: error.message,
    });
  }
};

export const listDoctorsByDepartment = async (req, res) => {
  try {
    const { department_id } = req.params;
    const doctors = await Doctor.findAll({
      where: { department_id: Number(department_id) },
      order: [["doctor_id", "DESC"]],
    });

    return res.json({
      success: true,
      count: doctors.length,
      doctors,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch doctors by department",
      details: error.message,
    });
  }
};

export const updateDoctor = async (req, res) => {
  try {
    const { doctor_id } = req.params;
    const doctor = await Doctor.findByPk(Number(doctor_id));

    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: "Doctor not found",
      });
    }

    const updates = {};
    const fields = [
      "user_id",
      "department_id",
      "doctor_name",
      "doctor_fee",
      "specialization",
      "experience_year",
      "bio",
    ];

    for (const field of fields) {
      if (req.body[field] !== undefined) {
        updates[field] =
          field === "user_id" || field === "department_id"
            ? Number(req.body[field])
            : req.body[field];
      }
    }

    await doctor.update(updates);

    return res.json({
      success: true,
      message: "Doctor updated successfully",
      doctor,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to update doctor",
      details: error.message,
    });
  }
};

export const deleteDoctor = async (req, res) => {
  try {
    const { doctor_id } = req.params;
    const doctor = await Doctor.findByPk(Number(doctor_id));

    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: "Doctor not found",
      });
    }

    await doctor.destroy();

    return res.json({
      success: true,
      message: "Doctor deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to delete doctor",
      details: error.message,
    });
  }
};
