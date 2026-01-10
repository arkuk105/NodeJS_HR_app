import express from 'express';
import {
  getEmployees,
  getEmployeeById,
  createEmployee,
  updateEmployee,
  deleteEmployee,
  getDepartments,
  getTeams,
} from '../controllers/employeeController.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = express.Router();

router.get('/', authenticate, getEmployees);
router.get('/departments', authenticate, getDepartments);
router.get('/teams', authenticate, getTeams);
router.get('/:id', authenticate, getEmployeeById);
router.post('/', authenticate, authorize('hr_admin', 'manager'), createEmployee);
router.put('/:id', authenticate, authorize('hr_admin', 'manager'), updateEmployee);
router.delete('/:id', authenticate, authorize('hr_admin'), deleteEmployee);

export default router;
