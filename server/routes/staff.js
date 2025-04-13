const express = require('express');
const router = express.Router();
const {
  getClassStudents,
  verifyProofs,
  getMentoredTeams
} = require('../controllers/staffController');
const { authenticate, checkRole } = require('../middlewares/authMiddleware');

router.get(
  '/class-students',
  authenticate,
  checkRole('staff'),
  getClassStudents
);
router.put(
  '/verify-proofs/:teamId',
  authenticate,
  checkRole('staff'),
  verifyProofs
);
router.get(
  '/mentored-teams',
  authenticate,
  checkRole('staff'),
  getMentoredTeams
);

module.exports = router;
