const express = require('express');
const router = express.Router();

const {
  createDepartment,
  updateDepartment,
  getDepartments,
  getDepartmentById,
  getDepartmentDropdown,
  deleteDepartment
} = require('../controllers/departmentController');

const { authenticate, checkRole } = require('../middlewares/authMiddleware');

router.post(
  '/create-department',
  authenticate,
  checkRole('superadmin', 'innovation','hod'),
  createDepartment
);

router.put(
  '/:id',
  authenticate,
  checkRole('superadmin', 'innovation','hod'),
  updateDepartment
);

router.get(
  '/',
  authenticate,
  checkRole('superadmin', 'innovation','hod'),
  getDepartments
);

router.get(
  '/dropdown',
  authenticate,
  checkRole('superadmin', 'innovation','hod'),
  getDepartmentDropdown
);

router.get(
  '/:id',
  authenticate,
  checkRole('superadmin', 'innovation','hod'),
  getDepartmentById
);

router.delete(
  '/:id',
  authenticate,
  checkRole('superadmin', 'innovation','hod'),
  deleteDepartment
);

module.exports = router;
