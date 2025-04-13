const Event = require('../models/Event');
const Request = require('../models/Request');
const Team = require('../models/Team');
const { checkRole } = require('../middlewares/authMiddleware');

// @desc    Request new event from Innovation Cell
// @route   POST /api/hod/request-event
exports.requestEvent = async (req, res) => {
  try {
    const { title, type, description } = req.body;
    const newRequest = new Request({
      type: 'hod-event',
      sender: req.user.id,
      department: req.user.department,
      event: { title, type, description },
      status: 'pending'
    });

    await newRequest.save();
    res.status(201).json(newRequest);
  } catch (err) {
    res.status(500).json({ error: 'Event request failed' });
  }
};

// @desc    Approve/reject student teams
// @route   PUT /api/hod/approve-team/:teamId
exports.approveTeam = async (req, res) => {
  try {
    const team = await Team.findById(req.params.teamId)
      .populate('event')
      .populate('members');

    // Check if event belongs to HOD's department
    if (team.event.department.toString() !== req.user.department.toString()) {
      return res.status(403).json({ error: 'Unauthorized department access' });
    }

    team.status = req.body.status; // 'approved' or 'rejected'
    await team.save();
    res.json(team);
  } catch (err) {
    res.status(500).json({ error: 'Team approval failed' });
  }
};

// @desc    Generate department reports
// @route   GET /api/hod/department-reports
exports.getDepartmentReports = async (req, res) => {
  try {
    const reports = await Team.aggregate([
      {
        $lookup: {
          from: 'events',
          localField: 'event',
          foreignField: '_id',
          as: 'event'
        }
      },
      { $unwind: '$event' },
      {
        $match: {
          'event.department': req.user.department
        }
      }
    ]);

    res.json(reports);
  } catch (err) {
    res.status(500).json({ error: 'Failed to generate reports' });
  }
};
