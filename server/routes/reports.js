const express = require('express');
const router = express.Router();
const {
  getReportsUsers,
  getUserDetailedReport,
  getReportsDepartments
} = require('../controllers/reportsController');
const { authenticate, checkRole } = require('../middlewares/authMiddleware');

// Get users for reports (role-based filtering)
router.get(
  '/users',
  authenticate,
  checkRole(['superadmin', 'principal', 'innovation', 'hod', 'staff']),
  getReportsUsers
);

// Get detailed user report
router.get(
  '/users/:id',
  authenticate,
  checkRole(['superadmin', 'principal', 'innovation', 'hod', 'staff']),
  getUserDetailedReport
);

// Get departments for filter dropdown
router.get(
  '/departments',
  authenticate,
  checkRole(['superadmin', 'principal', 'innovation', 'hod', 'staff']),
  getReportsDepartments
);

module.exports = router;
