const express = require('express');
const router = express.Router();
const {
  getStudentDashboard,
  getStaffDashboard,
  getInnovationDashboard,
  getSuperAdminDashboard,
  getPrincipalDashboard,
  getPastParticipations
} = require('../controllers/dashboardController');
const { authenticate, checkRole } = require('../middlewares/authMiddleware');

// Student dashboard
router.get('/student', authenticate, checkRole('student'), getStudentDashboard);

// Staff dashboard
router.get('/staff', authenticate, checkRole('staff'), getStaffDashboard);

// Innovation cell dashboard
router.get(
  '/innovation',
  authenticate,
  checkRole('innovation'),
  getInnovationDashboard
);

// Super admin dashboard
router.get(
  '/super-admin',
  authenticate,
  checkRole('superadmin'),
  getSuperAdminDashboard
);

// Principal dashboard
router.get(
  '/principal',
  authenticate,
  checkRole('principal'),
  getPrincipalDashboard
);

// Past participations
router.get(
  '/past-participations',
  authenticate,
  checkRole('student'),
  getPastParticipations
);

module.exports = router;
