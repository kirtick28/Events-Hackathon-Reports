const express = require('express');
const router = express.Router();
const {
  requestEvent,
  approveTeam,
  getDepartmentReports
} = require('../controllers/hodController');
const { authenticate, checkRole } = require('../middlewares/authMiddleware');

router.post('/request-event', authenticate, checkRole('hod'), requestEvent);
router.put(
  '/approve-team/:teamId',
  authenticate,
  checkRole('hod'),
  approveTeam
);
router.get(
  '/department-reports',
  authenticate,
  checkRole('hod'),
  getDepartmentReports
);

module.exports = router;
