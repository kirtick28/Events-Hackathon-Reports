const express = require('express');
const router = express.Router();
const {
  getEvents,
  createTeam,
  sendRequest,
  addPastParticipation,
  getRegistrationStatus
} = require('../controllers/studentController');
const { authenticate, checkRole } = require('../middlewares/authMiddleware');

router.get('/events', authenticate, checkRole('student'), getEvents);
router.get(
  '/registration-status/:eventId',
  authenticate,
  checkRole('student'),
  getRegistrationStatus
);
router.post('/create-team', authenticate, checkRole('student'), createTeam);
router.post('/send-request', authenticate, checkRole('student'), sendRequest);
router.post(
  '/add-past-participation',
  authenticate,
  checkRole('student'),
  addPastParticipation
);

module.exports = router;
