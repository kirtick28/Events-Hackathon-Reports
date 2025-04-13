const express = require('express');
const router = express.Router();
const {
  generateReports,
  getHistoricalData
} = require('../controllers/principalController');
const { authenticate, checkRole } = require('../middlewares/authMiddleware');

router.get('/reports', authenticate, checkRole('principal'), generateReports);
router.get(
  '/historical-data',
  authenticate,
  checkRole('principal'),
  getHistoricalData
);

module.exports = router;
