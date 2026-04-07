import db from "../models/index.js";

const { Notification } = db;

export const createNotification = async (req, res) => {
  try {
    const { user_id, title, message } = req.body;

    if (!user_id || !title || !message) {
      return res.status(400).json({
        success: false,
        message: "user_id, title and message are required",
      });
    }

    const notification = await Notification.create({
      user_id: Number(user_id),
      title,
      message,
    });

    return res.status(201).json({
      success: true,
      message: "Notification created successfully",
      notification,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to create notification",
      details: error.message,
    });
  }
};

export const getUserNotifications = async (req, res) => {
  try {
    const { user_id } = req.params;
    const notifications = await Notification.findAll({
      where: { user_id: Number(user_id) },
      order: [["notification_id", "DESC"]],
    });

    return res.json({
      success: true,
      count: notifications.length,
      notifications,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch notifications",
      details: error.message,
    });
  }
};

export const markAsRead = async (req, res) => {
  try {
    const { notification_id } = req.params;
    const notification = await Notification.findByPk(Number(notification_id));

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: "Notification not found",
      });
    }

    await notification.update({ is_read: true });

    return res.json({
      success: true,
      message: "Notification marked as read",
      notification,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to update notification",
      details: error.message,
    });
  }
};
