import db from "../models/index.js";

const { Schedule } = db;

export const createSchedule = async (req, res) => {
  try {
    const {
      doctor_id,
      schedule_date,
      start_time,
      end_time,
      status,
      max_patient,
    } = req.body;

    if (!doctor_id || !schedule_date || !start_time || !end_time) {
      return res.status(400).json({
        error: "doctor_id, schedule_date, start_time and end_time are required",
      });
    }

    const schedule = await Schedule.create({
      doctor_id: Number(doctor_id),
      schedule_date,
      start_time,
      end_time,
      status: status || "available",
      max_patient: max_patient ? Number(max_patient) : 1,
    });

    return res.status(201).json({
      message: "Schedule created successfully",
      schedule,
    });
  } catch (err) {
    return res.status(500).json({
      error: "Failed to create schedule",
      details: err.message,
    });
  }
};

export const getDoctorSchedule = async (req, res) => {
  try {
    const { doctor_id } = req.params;
    const { status, schedule_date } = req.query;

    const where = {
      doctor_id: Number(doctor_id),
    };

    if (status) {
      where.status = status;
    }

    if (schedule_date) {
      where.schedule_date = schedule_date;
    }

    const schedules = await Schedule.findAll({
      where,
      order: [
        ["schedule_date", "ASC"],
        ["start_time", "ASC"],
      ],
    });

    return res.json({
      count: schedules.length,
      schedules,
    });
  } catch (err) {
    return res.status(500).json({
      error: "Failed to fetch doctor schedule",
      details: err.message,
    });
  }
};

export const updateSchedule = async (req, res) => {
  try {
    const { schedule_id } = req.params;
    const schedule = await Schedule.findByPk(Number(schedule_id));

    if (!schedule) {
      return res.status(404).json({
        error: "Schedule not found",
      });
    }

    const updates = {};
    const allowedFields = [
      "doctor_id",
      "schedule_date",
      "start_time",
      "end_time",
      "status",
      "max_patient",
    ];

    for (const field of allowedFields) {
      if (req.body[field] !== undefined) {
        updates[field] =
          field === "doctor_id" || field === "max_patient"
            ? Number(req.body[field])
            : req.body[field];
      }
    }

    await schedule.update(updates);

    return res.json({
      message: "Schedule updated successfully",
      schedule,
    });
  } catch (err) {
    return res.status(500).json({
      error: "Failed to update schedule",
      details: err.message,
    });
  }
};

export const deleteSchedule = async (req, res) => {
  try {
    const { schedule_id } = req.params;

    const schedule = await Schedule.findByPk(Number(schedule_id));

    if (!schedule) {
      return res.status(404).json({
        error: "Schedule not found",
      });
    }

    await schedule.destroy();

    return res.json({
      message: "Schedule deleted successfully",
    });
  } catch (err) {
    return res.status(500).json({
      error: "Failed to delete schedule",
      details: err.message,
    });
  }
};
