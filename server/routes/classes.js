const express = require('express');
const router = express.Router();

const {
  createClass,
  updateClass,
  getClasses,
  getClassById,
  deleteClass
} = require('../controllers/classController');

const { authenticate, checkRole } = require('../middlewares/authMiddleware');

router.post(
  '/create-class',
  authenticate,
  checkRole('superadmin', 'innovation', 'hod'),
  createClass
);

router.put(
  '/:id',
  authenticate,
  checkRole('superadmin', 'innovation', 'hod'),
  updateClass
);

router.get(
  '/',
  authenticate,
  checkRole('superadmin', 'innovation', 'hod', 'staff'),
  getClasses
);

router.get(
  '/:id',
  authenticate,
  checkRole('superadmin', 'innovation', 'hod', 'staff'),
  getClassById
);

router.delete(
  '/:id',
  authenticate,
  checkRole('superadmin', 'innovation', 'hod'),
  deleteClass
);

module.exports = router;
