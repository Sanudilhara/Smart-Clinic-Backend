import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import db from "../models/index.js";

dotenv.config();

const { User, Role } = db;
const SELF_SERVICE_ROLE_NAME = "patient";

const findSelfServiceRole = async () =>
  Role.findOne({
    where: { role_name: SELF_SERVICE_ROLE_NAME },
  });

// Access Token generate function
const generateAccessToken = (user) => {
  return jwt.sign(
    {
      id: user.user_id,
      email: user.user_email,
      name: user.user_name,
      role_id: user.role_id,
    },
    process.env.JWT_SECRET,
    { expiresIn: "15m" }
  );
};

// Refresh Token generate function
const generateRefreshToken = (user) => {
  return jwt.sign(
    {
      id: user.user_id,
    },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: "7d" }
  );
};

// Register
export const registerUser = async (req, res) => {
  try {
    const { name, email, password, phone, role_id } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "name, email and password are required",
      });
    }

    const existingUser = await User.findOne({
      where: { user_email: email },
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "Email already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const selfServiceRole = await findSelfServiceRole();

    if (!selfServiceRole) {
      return res.status(500).json({
        success: false,
        message: "Self-service registration role is not configured",
      });
    }

    if (role_id !== undefined && Number(role_id) !== selfServiceRole.role_id) {
      return res.status(403).json({
        success: false,
        message: `Public registration is limited to the ${SELF_SERVICE_ROLE_NAME} role`,
      });
    }

    const newUser = await User.create({
      user_name: name,
      user_email: email,
      password: hashedPassword,
      role_id: selfServiceRole.role_id,
      user_contact: phone || null,
      is_active: true,
    });

    return res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: {
        user_id: newUser.user_id,
        name: newUser.user_name,
        email: newUser.user_email,
        phone: newUser.user_contact,
        role_id: newUser.role_id,
        is_active: newUser.is_active,
        created_at: newUser.created_at,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Login
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    const user = await User.findOne({
      where: { user_email: email },
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    if (!user.is_active) {
      return res.status(403).json({
        success: false,
        message: "User account is inactive",
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    return res.status(200).json({
      success: true,
      message: "Login successful",
      accessToken,
      refreshToken,
      user: {
        user_id: user.user_id,
        email: user.user_email,
        name: user.user_name,
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

// Refresh Access Token
export const refreshAccessToken = async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(401).json({
        success: false,
        message: "Refresh token is required",
      });
    }

    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);

    const user = await User.findByPk(decoded.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (!user.is_active) {
      return res.status(403).json({
        success: false,
        message: "User account is inactive",
      });
    }

    const newAccessToken = generateAccessToken(user);

    return res.status(200).json({
      success: true,
      accessToken: newAccessToken,
    });
  } catch (error) {
    return res.status(403).json({
      success: false,
      message: "Invalid or expired refresh token",
    });
  }
};

// Get Logged-in User Profile
export const getProfile = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: { exclude: ["password"] },
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: {
        user_id: user.user_id,
        name: user.user_name,
        email: user.user_email,
        phone: user.user_contact,
        role_id: user.role_id,
        is_active: user.is_active,
        created_at: user.created_at,
        updated_at: user.updated_at,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Change Password
export const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: "Current password and new password are required",
      });
    }

    const user = await User.findByPk(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);

    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Current password is incorrect",
      });
    }

    const hashedNewPassword = await bcrypt.hash(newPassword, 10);

    await user.update({
      password: hashedNewPassword,
    });

    return res.status(200).json({
      success: true,
      message: "Password changed successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
