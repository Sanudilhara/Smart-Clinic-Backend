import express from 'express';
import {
  createDepartment,
  listDepartments,
  updateDepartment,
  deleteDepartment
} from '../controllers/departmentsController.js';

const router = express.Router();

// Create department
router.post('/', createDepartment);

// List all departments
router.get('/', listDepartments);

// Update department
router.put('/:department_id', updateDepartment);

// Delete department
router.delete('/:department_id', deleteDepartment);

export default router;