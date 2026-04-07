import db from "../models/index.js";

const { User, Role } = db;

const parseBoolean = (value) => {
  if (typeof value === "boolean") {
    return value;
  }

  if (typeof value === "string") {
    const normalized = value.trim().toLowerCase();
    if (normalized === "true") {
      return true;
    }
    if (normalized === "false") {
      return false;
    }
  }

  return undefined;
};

const parseInteger = (value) => {
  const parsed = Number(value);
  return Number.isInteger(parsed) ? parsed : undefined;
};

const canManageUser = async (requestUser, targetUserId) => {
  if (!requestUser?.id) {
    return false;
  }

  if (requestUser.id === targetUserId) {
    return true;
  }

  if (!requestUser.role_id) {
    return false;
  }

  const role = await Role.findByPk(requestUser.role_id);
  return ["admin", "super_admin"].includes(role?.role_name?.toLowerCase());
};

export const users = async (req, res) => {
  try {
    const allUsers = await User.findAll({
      attributes: { exclude: ["password"] },
    });

    res.json({
      success: true,
      data: allUsers,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getUserById = async (req, res) => {
  try {
    const targetUserId = parseInteger(req.params.user_id);

    if (targetUserId === undefined) {
      return res.status(400).json({
        success: false,
        message: "Invalid user_id",
      });
    }

    if (!(await canManageUser(req.user, targetUserId))) {
      return res.status(403).json({
        success: false,
        message: "You are not allowed to view this user",
      });
    }

    const user = await User.findByPk(targetUserId, {
      attributes: { exclude: ["password"] },
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.json({
      success: true,
      data: user,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const updateUser = async (req, res) => {
  try {
    const targetUserId = parseInteger(req.params.user_id);

    if (targetUserId === undefined) {
      return res.status(400).json({
        success: false,
        message: "Invalid user_id",
      });
    }

    if (!(await canManageUser(req.user, targetUserId))) {
      return res.status(403).json({
        success: false,
        message: "You are not allowed to update this user",
      });
    }

    const user = await User.findByPk(targetUserId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const updates = {};

    if (req.body.name !== undefined) {
      updates.user_name = req.body.name;
    }
    if (req.body.email !== undefined) {
      updates.user_email = req.body.email;
    }
    if (req.body.phone !== undefined) {
      updates.user_contact = req.body.phone;
    }
    if (req.body.role_id !== undefined) {
      const parsedRoleId = parseInteger(req.body.role_id);

      if (parsedRoleId === undefined) {
        return res.status(400).json({
          success: false,
          message: "role_id must be a valid integer",
        });
      }

      const role = await Role.findByPk(parsedRoleId);
      if (!role) {
        return res.status(400).json({
          success: false,
          message: "role_id does not exist",
        });
      }

      updates.role_id = parsedRoleId;
    }
    if (req.body.is_active !== undefined) {
      const parsedIsActive = parseBoolean(req.body.is_active);

      if (parsedIsActive === undefined) {
        return res.status(400).json({
          success: false,
          message: "is_active must be true or false",
        });
      }

      updates.is_active = parsedIsActive;
    }

    await user.update(updates);

    return res.json({
      success: true,
      data: {
        user_id: user.user_id,
        name: user.user_name,
        email: user.user_email,
        phone: user.user_contact,
        role_id: user.role_id,
        is_active: user.is_active,
        created_at: user.created_at,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const targetUserId = parseInteger(req.params.user_id);

    if (targetUserId === undefined) {
      return res.status(400).json({
        success: false,
        message: "Invalid user_id",
      });
    }

    if (!(await canManageUser(req.user, targetUserId))) {
      return res.status(403).json({
        success: false,
        message: "You are not allowed to delete this user",
      });
    }

    const user = await User.findByPk(targetUserId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    await user.destroy();

    return res.json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
