import db from "../models/index.js";

const { Room } = db;

export const createRoom = async (req, res) => {
  try {
    const { doctor_id, room_no, status } = req.body;

    if (!doctor_id || !room_no?.trim()) {
      return res.status(400).json({
        error: "doctor_id and room_no are required",
      });
    }

    const existingRoom = await Room.findOne({
      where: { room_no: room_no.trim() },
    });

    if (existingRoom) {
      return res.status(409).json({
        error: "Room already exists",
      });
    }

    const room = await Room.create({
      doctor_id: Number(doctor_id),
      room_no: room_no.trim(),
      status: status || "available",
    });

    return res.status(201).json({
      message: "Room created successfully",
      room,
    });
  } catch (err) {
    return res.status(500).json({
      error: "Failed to create room",
      details: err.message,
    });
  }
};

export const getRooms = async (req, res) => {
  try {
    const { status } = req.query;

    const where = {};
    if (status !== undefined) {
      where.status = status;
    }

    const rooms = await Room.findAll({
      where,
      order: [["room_id", "ASC"]],
    });

    return res.json({
      count: rooms.length,
      rooms,
    });
  } catch (err) {
    return res.status(500).json({
      error: "Failed to fetch rooms",
      details: err.message,
    });
  }
};

export const getRoomById = async (req, res) => {
  try {
    const { room_id } = req.params;

    const room = await Room.findByPk(Number(room_id));

    if (!room) {
      return res.status(404).json({
        error: "Room not found",
      });
    }

    return res.json({ room });
  } catch (err) {
    return res.status(500).json({
      error: "Failed to fetch room",
      details: err.message,
    });
  }
};

export const updateRoom = async (req, res) => {
  try {
    const { room_id } = req.params;
    const { doctor_id, room_no, status } = req.body;

    const room = await Room.findByPk(Number(room_id));

    if (!room) {
      return res.status(404).json({
        error: "Room not found",
      });
    }

    const updates = {};
    if (doctor_id !== undefined) {
      updates.doctor_id = Number(doctor_id);
    }
    if (room_no !== undefined) {
      if (!String(room_no).trim()) {
        return res.status(400).json({
          error: "Room number cannot be empty",
        });
      }
      updates.room_no = String(room_no).trim();
    }
    if (status !== undefined) {
      updates.status = status;
    }

    await room.update(updates);

    return res.json({
      message: "Room updated successfully",
      room,
    });
  } catch (err) {
    return res.status(500).json({
      error: "Failed to update room",
      details: err.message,
    });
  }
};

export const deleteRoom = async (req, res) => {
  try {
    const { room_id } = req.params;

    const room = await Room.findByPk(Number(room_id));

    if (!room) {
      return res.status(404).json({
        error: "Room not found",
      });
    }

    await room.destroy();

    return res.json({
      message: "Room deleted successfully",
    });
  } catch (err) {
    return res.status(500).json({
      error: "Failed to delete room",
      details: err.message,
    });
  }
};
