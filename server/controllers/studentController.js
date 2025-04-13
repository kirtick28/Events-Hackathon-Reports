const Event = require('../models/Event');
const Team = require('../models/Team');
const Request = require('../models/Request');
const PastParticipation = require('../models/PastParticipation');

// @desc    Get eligible events
// @route   GET /api/students/events
exports.getEvents = async (req, res) => {
  try {
    const student = await User.findById(req.user.id);
    const events = await Event.find({
      $or: [
        { scope: 'college' },
        {
          scope: 'department',
          department: student.department,
          'eligibility.years': student.year
        }
      ],
      status: 'approved'
    });
    res.json(events);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch events' });
  }
};

// @desc    Create new team
// @route   POST /api/students/create-team
exports.createTeam = async (req, res) => {
  try {
    const { eventId, members } = req.body;
    const event = await Event.findById(eventId);

    // Validate team size
    if (
      members.length < event.eligibility.teamSize.min ||
      members.length > event.eligibility.teamSize.max
    ) {
      return res.status(400).json({ error: 'Invalid team size' });
    }

    // Check if all members are eligible
    const invalidMembers = await User.find({
      _id: { $in: members },
      department: { $nin: event.eligibility.departments },
      year: { $nin: event.eligibility.years }
    });

    if (invalidMembers.length > 0) {
      return res.status(400).json({ error: 'Some members are not eligible' });
    }

    const newTeam = new Team({
      event: eventId,
      members,
      advisor: req.user.advisor // Assuming advisor is stored in user model
    });

    await newTeam.save();
    res.status(201).json(newTeam);
  } catch (err) {
    res.status(500).json({ error: 'Team creation failed' });
  }
};

// @desc    Send team request
// @route   POST /api/students/send-request
exports.sendRequest = async (req, res) => {
  try {
    const { receiverId, teamId } = req.body;

    // Check if receiver is eligible
    const team = await Team.findById(teamId).populate('event');
    const receiver = await User.findById(receiverId);

    if (!team.event.eligibility.departments.includes(receiver.department)) {
      return res.status(400).json({ error: 'Receiver not eligible' });
    }

    const newRequest = new Request({
      type: 'team-invite',
      sender: req.user.id,
      receiver: receiverId,
      team: teamId,
      status: 'pending'
    });

    await newRequest.save();
    res.status(201).json(newRequest);
  } catch (err) {
    res.status(500).json({ error: 'Request sending failed' });
  }
};

// @desc    Add past participation
// @route   POST /api/students/add-past-participation
exports.addPastParticipation = async (req, res) => {
  try {
    const { eventName, type, date, proofs } = req.body;

    const participation = new PastParticipation({
      student: req.user.id,
      eventName,
      type,
      date,
      proofs,
      verifiedBy: req.user.advisor
    });

    await participation.save();
    res.status(201).json(participation);
  } catch (err) {
    res.status(500).json({ error: 'Failed to add participation' });
  }
};
