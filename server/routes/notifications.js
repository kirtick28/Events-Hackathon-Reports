const express = require('express');
const router = express.Router();
const {
  getNotifications,
  markAsRead
} = require('../controllers/notificationController');
const { authenticate } = require('../middlewares/authMiddleware');

router.get('/', authenticate, getNotifications);
router.put('/mark-read/:notificationId', authenticate, markAsRead);

module.exports = router;
