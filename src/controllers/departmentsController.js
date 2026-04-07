import db from "../models/index.js";

const { Department } = db;

export const createDepartment = async (req, res) => {
  try {
    const { department_name } = req.body;

    if (!department_name?.trim()) {
      return res.status(400).json({
        error: "Department name is required",
      });
    }

    const existingDepartment = await Department.findOne({
      where: { department_name: department_name.trim() },
    });

    if (existingDepartment) {
      return res.status(409).json({
        error: "Department already exists",
      });
    }

    const department = await Department.create({
      department_name: department_name.trim(),
    });

    return res.status(201).json({
      message: "Department created successfully",
      department,
    });
  } catch (err) {
    return res.status(500).json({
      error: "Failed to create department",
      details: err.message,
    });
  }
};

export const listDepartments = async (req, res) => {
  try {
    const departments = await Department.findAll({
      order: [["department_id", "ASC"]],
    });

    return res.json({
      count: departments.length,
      departments,
    });
  } catch (err) {
    return res.status(500).json({
      error: "Failed to fetch departments",
      details: err.message,
    });
  }
};

export const updateDepartment = async (req, res) => {
  try {
    const { department_id } = req.params;
    const { department_name } = req.body;

    const department = await Department.findByPk(Number(department_id));

    if (!department) {
      return res.status(404).json({
        error: "Department not found",
      });
    }

    if (!department_name?.trim()) {
      return res.status(400).json({
        error: "Department name is required",
      });
    }

    await department.update({
      department_name: department_name.trim(),
    });

    return res.json({
      message: "Department updated successfully",
      department,
    });
  } catch (err) {
    return res.status(500).json({
      error: "Failed to update department",
      details: err.message,
    });
  }
};

export const deleteDepartment = async (req, res) => {
  try {
    const { department_id } = req.params;

    const department = await Department.findByPk(Number(department_id));

    if (!department) {
      return res.status(404).json({
        error: "Department not found",
      });
    }

    await department.destroy();

    return res.json({
      message: "Department deleted successfully",
    });
  } catch (err) {
    return res.status(500).json({
      error: "Failed to delete department",
      details: err.message,
    });
  }
};
