const Team = require('../models/Team');
const User = require('../models/User');

// @desc    Get class students
// @route   GET /api/staff/class-students
exports.getClassStudents = async (req, res) => {
  try {
    const students = await User.find({
      role: 'student',
      class: req.user.class,
      department: req.user.department
    }).select('name email year');

    res.json(students);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch students' });
  }
};

// @desc    Verify team proofs
// @route   PUT /api/staff/verify-proofs/:teamId
exports.verifyProofs = async (req, res) => {
  try {
    const team = await Team.findById(req.params.teamId);

    // Check if staff is the advisor
    if (!team.advisor.equals(req.user.id)) {
      return res
        .status(403)
        .json({ error: 'Not authorized to verify this team' });
    }

    team.verificationStatus = req.body.status;
    if (req.body.status === 'approved') {
      team.status = 'verified';
    }
    await team.save();

    res.json(team);
  } catch (err) {
    res.status(500).json({ error: 'Proof verification failed' });
  }
};

// @desc    Get mentored teams
// @route   GET /api/staff/mentored-teams
exports.getMentoredTeams = async (req, res) => {
  try {
    const teams = await Team.find({ advisor: req.user.id })
      .populate('event', 'title type')
      .populate('members', 'name');

    res.json(teams);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch teams' });
  }
};
