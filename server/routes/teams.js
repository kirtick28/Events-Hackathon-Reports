const express = require('express');
const router = express.Router();
const {
  createTeam,
  getTeamDetails,
  respondToInvitation,
  getUserInvitations,
  getUserTeams,
  getAvailableUsers,
  submitProofs
} = require('../controllers/teamController');
const { authenticate, checkRole } = require('../middlewares/authMiddleware');

// Team creation and management
router.post('/create', authenticate, checkRole('student'), createTeam);
router.get('/my-teams', authenticate, getUserTeams);
router.get('/invitations', authenticate, getUserInvitations);
router.get('/available-users/:eventId', authenticate, getAvailableUsers);

// Team details and responses
router.get('/:teamId', authenticate, getTeamDetails);
router.post('/:teamId/respond', authenticate, respondToInvitation);

// Team proofs
router.post('/submit-proofs/:teamId', authenticate, submitProofs);

module.exports = router;
