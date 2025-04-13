const Team = require('../models/Team');
const User = require('../models/User');

// @desc    Get team details
// @route   GET /api/teams/:teamId
exports.getTeamDetails = async (req, res) => {
  try {
    const team = await Team.findById(req.params.teamId)
      .populate('event')
      .populate('members', 'name email')
      .populate('advisor', 'name');

    if (!team) {
      return res.status(404).json({ error: 'Team not found' });
    }

    // Allow access to team members + admins
    const isMember = team.members.some((m) => m._id.equals(req.user.id));
    const isAdmin = ['innovation', 'principal'].includes(req.user.role);

    if (!isMember && !isAdmin) {
      return res.status(403).json({ error: 'Unauthorized access' });
    }

    res.json(team);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch team details' });
  }
};

// @desc    Submit proofs for team
// @route   POST /api/teams/submit-proofs/:teamId
exports.submitProofs = async (req, res) => {
  try {
    const team = await Team.findById(req.params.teamId);

    // Only team leader can submit proofs
    const isLeader = team.members[0].equals(req.user.id);
    if (!isLeader) {
      return res
        .status(403)
        .json({ error: 'Only team leader can submit proofs' });
    }

    team.proofs = [...team.proofs, ...req.body.fileIds]; // Array of file IDs from upload
    team.status = 'pending_verification';
    await team.save();

    res.json(team);
  } catch (err) {
    res.status(500).json({ error: 'Proof submission failed' });
  }
};
