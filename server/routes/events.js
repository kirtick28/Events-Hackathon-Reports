const express = require('express');
const router = express.Router();
const {
  createEvent,
  getAllEvents,
  getEventById,
  updateEvent,
  deleteEvent,
  handleEventApproval,
  freezeTeam,
  getDraftEvents,
  getEventRegistrations,
  deleteDraftEvent
} = require('../controllers/eventController');
const { authenticate, checkRole } = require('../middlewares/authMiddleware');

// Event CRUD routes
router.post('/', authenticate, checkRole('innovation','hod'), createEvent);
router.get('/', authenticate, getAllEvents);
router.get('/:eventId', authenticate, getEventById);
router.put('/:eventId', authenticate, checkRole('innovation','hod'), updateEvent);
router.delete('/:eventId', authenticate, checkRole('innovation','hod'), deleteEvent);

// Draft management routes
router.get('/drafts/:id', authenticate, checkRole('innovation','hod'), getDraftEvents);

router.delete(
  '/drafts/:eventId',
  authenticate,
  checkRole('innovation','hod'),
  deleteDraftEvent
);

// Registration tracking routes
router.get(
  '/:eventId/registrations',
  authenticate,
  checkRole('innovation'),
  getEventRegistrations
);

// Request handling
router.patch(
  '/request/:eventId/:status',
  authenticate,
  checkRole('innovation','hod'),
  handleEventApproval
);

// Team management
router.put(
  '/freeze-team/:teamId',
  authenticate,
  checkRole('innovation'),
  freezeTeam
);

module.exports = router;
