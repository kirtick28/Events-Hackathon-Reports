const express = require('express');
const router = express.Router();
const {
  login,
  resetPassword,
  updatePassword,
  getProfile,
  updateProfile,
  registerSuperAdmin
} = require('../controllers/authController');
const { authenticate } = require('../middlewares/authMiddleware');

router.post('/register-superadmin', registerSuperAdmin);
router.post('/login', login);
router.post('/reset-password', resetPassword);
router.post('/update-password/:token', updatePassword);
router.get('/profile', authenticate, getProfile);
router.put('/update-profile', authenticate, updateProfile);

module.exports = router;
