const Event = require('../models/Event');
const Request = require('../models/Request');
const Team = require('../models/Team');

function removeEmptyStrings(obj) {
  for (let key in obj) {
    if (obj[key] === '') {
      delete obj[key];
    } else if (typeof obj[key] === 'object' && !Array.isArray(obj[key])) {
      removeEmptyStrings(obj[key]);
    }
  }
}

/**
 * @desc    Create a new event or save as draft
 * @route   POST /api/events
 * @access  Private (innovation, hod)
 */
exports.createEvent = async (req, res) => {
  try {
    console.log('Request body after removing empty strings:', req.body);
    const { status = 'draft' } = req.body;
    removeEmptyStrings(req.body);

    let eventStatus;
    if (status === 'draft') {
      eventStatus = 'draft';
    } else {
      if (req.user.role === 'innovation') {
        eventStatus = 'approved';
      } else {
        eventStatus = 'pending';
      }
    }
    const options = {};
    if (status === 'draft') {
      options.validateBeforeSave = false;
    }

    const newEvent = new Event({
      ...req.body,
      createdBy: req.user.id,
      status: eventStatus
    });

    await newEvent.save(options);
    res.status(201).json(newEvent);
  } catch (err) {
    console.error(err);
    res.status(400).json({
      error: 'Event creation failed',
      details: err.message,
      ...(err.errors && { validationErrors: err.errors })
    });
  }
};

/**
 * @desc    Get all events (including drafts)
 * @route   GET /api/events
 * @access  Public
 */
exports.getAllEvents = async (req, res) => {
  try {
    const { status, createdBy } = req.query;

    // Build dynamic filter object
    const filter = {};
    if (status) {
      filter.status = status; // e.g., 'approved', 'pending', 'rejected'
    }
    if (createdBy) {
      filter.createdBy = createdBy; // MongoDB ObjectId
    }

    const events = await Event.find(filter)
      .populate('department createdBy')
      .sort({ createdAt: -1 });

    res.json(events);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Fetching events failed' });
  }
};


/**
 * @desc    Get single event details with registration stats
 * @route   GET /api/events/:eventId
 * @access  Public
 */
exports.getEventById = async (req, res) => {
  try {
    const event = await Event.findById(req.params.eventId).populate(
      'department createdBy'
    );

    if (!event) return res.status(404).json({ error: 'Event not found' });

    // Get registration statistics
    const teams = await Team.find({ event: event._id }).populate(
      'members',
      'name email'
    );

    const participantsCount = teams.reduce(
      (acc, team) => acc + team.members.length,
      0
    );
    const verifiedTeams = teams.filter(
      (team) => team.status === 'verified'
    ).length;

    const eventWithStats = {
      ...event.toObject(),
      teams: teams.length,
      participantsCount,
      verifiedTeams
    };

    res.json(eventWithStats);
  } catch (err) {
    res.status(500).json({ error: 'Fetching event failed' });
  }
};

/**
 * @desc    Update an event (only by creator or innovation role)
 * @route   PUT /api/events/:eventId
 * @access  Private (innovation, hod)
 */
exports.updateEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.eventId);

    if (!event) return res.status(404).json({ error: 'Event not found' });

    if (event.createdBy.toString() !== req.user.id) {
      return res
        .status(403)
        .json({ error: 'Unauthorized to update this event' });
    }

    const updatedData = {
      ...req.body,
    };

    const updatedEvent = await Event.findByIdAndUpdate(
      req.params.eventId,
      updatedData,
    );
    res.json(updatedEvent);
  } catch (err) {
    res.status(400).json({ error: 'Updating event failed' });
  }
};

/**
 * @desc    Delete an event (only by creator or innovation role)
 * @route   DELETE /api/events/:eventId
 * @access  Private (innovation)
 */
exports.deleteEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.eventId);
    if (!event) return res.status(404).json({ error: 'Event not found' });

    // Optional: Check if the user is the creator or has required role
    if (req.user.role !== 'innovation' && event.createdBy.toString() !== req.user.id) {
      return res
        .status(403)
        .json({ error: 'Unauthorized to delete this event' });
    }

    await Event.findByIdAndDelete(req.params.eventId);
    res.json({ message: 'Event deleted successfully' });
  } catch (err) {
    res.status(400).json({ error: 'Deleting event failed' });
  }
};

/**
 * @desc    Get draft events
 * @route   GET /api/events/drafts
 * @access  Private (innovation, hod)
 */
exports.getDraftEvents = async (req, res) => {
  try {
    const id = req.params.id
    const drafts = await Event.find({ status: 'draft', createdBy : id })
      .populate('department')
      .sort({ updatedAt: -1 });

    res.json(drafts);
  } catch (err) {
    res.status(500).json({ error: 'Fetching drafts failed' });
  }
};


/**
 * @desc    Get event registrations
 * @route   GET /api/events/:eventId/registrations
 * @access  Private (innovation, hod)
 */
exports.getEventRegistrations = async (req, res) => {
  try {
    const teams = await Team.find({ event: req.params.eventId })
      .populate('members', 'name email phone')
      .populate('advisor', 'name email');

    res.json({
      count: teams.length,
      participants: teams.flatMap((team) => team.members),
      teams
    });
  } catch (err) {
    res.status(500).json({ error: 'Fetching registrations failed' });
  }
};

/**
 * @desc    Freeze a team (no more changes allowed)
 * @route   PUT /api/teams/freeze/:teamId
 * @access  Private (innovation)
 */
exports.freezeTeam = async (req, res) => {
  try {
    const team = await Team.findById(req.params.teamId);

    if (!team) return res.status(404).json({ error: 'Team not found' });

    team.isFrozen = true;
    await team.save();

    res.json({ message: 'Team has been frozen successfully', team });
  } catch (err) {
    res.status(400).json({ error: 'Freezing team failed' });
  }
};

/**
 * @desc    Handle Event Approval (approve or reject)
 * @route   PATCH /api/events/request/:eventId/:status
 * @access  Private (innovation)
 */
exports.handleEventApproval = async (req, res) => {
  try {
    const { eventId, status } = req.params;

    // Validate status
    if (!['approved', 'rejected', 'pending'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status. Must be either approved or rejected' });
    }

    // Find the event by ID
    const event = await Event.findById(eventId);

    // Check if the event exists
    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }

    // Check if the event is in pending status
    if (event.status !== 'pending' && event.status !== 'rejected') {
      return res.status(400).json({ error: 'Event is not in pending or rejected status' });
    }

    // Update the event status
    event.status = status;
    await event.save();

    res.json({ 
      message: `Event ${status} successfully`, 
      event 
    });
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: 'Handling event approval failed' });
  }
};

/**
 * @desc    Delete a draft event (only if it's in draft status)
 * @route   DELETE /api/events/drafts/:eventId
 * @access  Private (innovation, hod)
 */
exports.deleteDraftEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.eventId);

    if (!event) return res.status(404).json({ error: 'Draft event not found' });

    // Check if it's actually a draft
    if (event.status !== 'draft') {
      return res
        .status(400)
        .json({ error: 'Only draft events can be deleted from here' });
    }

    // Optional: Verify if user is the creator
    if (event.createdBy.toString() !== req.user.id) {
      return res
        .status(403)
        .json({ error: 'Unauthorized to delete this draft' });
    }

    await Event.findByIdAndDelete(req.params.eventId);
    res.json({ message: 'Draft event deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: 'Deleting draft failed' });
  }
};
