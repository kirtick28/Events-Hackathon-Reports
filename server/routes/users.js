const express = require('express');
const router = express.Router();
const {
  createUser,
  updateUser,
  getUsers,
  bulkAddUsers,
  getUserById,
  deleteUser,
  getUsersForDropdown
} = require('../controllers/userController');
const { authenticate, checkRole } = require('../middlewares/authMiddleware');

router.get(
  '/dropdown',
  authenticate,
  checkRole('superadmin', 'innovation', 'hod', 'student'),
  getUsersForDropdown
);

router.post(
  '/create-user',
  authenticate,
  checkRole('superadmin', 'innovation', 'hod'),
  createUser
);

router.get(
  '/:id',
  authenticate,
  checkRole('superadmin', 'innovation', 'hod', 'staff'),
  getUserById
);

router.put(
  '/:id',
  authenticate,
  checkRole('superadmin', 'innovation', 'hod'),
  updateUser
);

router.get(
  '/',
  authenticate,
  checkRole('superadmin', 'innovation', 'hod', 'staff'),
  getUsers
);

router.post(
  '/bulk-add',
  authenticate,
  checkRole('superadmin', 'innovation', 'hod'),
  bulkAddUsers
);

router.delete(
  '/:id',
  authenticate,
  checkRole('superadmin', 'innovation', 'hod'),
  deleteUser
);

module.exports = router;
