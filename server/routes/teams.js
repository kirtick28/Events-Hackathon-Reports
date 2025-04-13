const express = require('express');
const router = express.Router();
const {
  getTeamDetails,
  submitProofs
} = require('../controllers/teamController');
const { authenticate } = require('../middlewares/authMiddleware');

router.get('/:teamId', authenticate, getTeamDetails);
router.post('/submit-proofs/:teamId', authenticate, submitProofs);

module.exports = router;
