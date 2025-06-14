const Team = require('../models/Team');
const User = require('../models/User');
const Event = require('../models/Event');

// @desc    Create new team
// @route   POST /api/teams/create
exports.createTeam = async (req, res) => {
  try {
    const { name, eventId, memberEmails, mentorEmail } = req.body;

    // Get event details
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }

    // Find users by email
    const memberUsers = await User.find({
      email: { $in: memberEmails },
      role: 'student'
    });

    if (memberUsers.length !== memberEmails.length) {
      return res.status(400).json({ error: 'Some student emails not found' });
    }

    // Check if any member is already in a team for this event
    const existingTeams = await Team.find({
      event: eventId,
      'members.user': { $in: memberUsers.map((u) => u._id) }
    });

    if (existingTeams.length > 0) {
      return res
        .status(400)
        .json({ error: 'Some students are already in a team for this event' });
    }

    // Validate team size
    const totalMembers = memberUsers.length + 1; // +1 for creator
    if (
      totalMembers < event.eligibility.teamSize.min ||
      totalMembers > event.eligibility.teamSize.max
    ) {
      return res.status(400).json({
        error: `Team size must be between ${event.eligibility.teamSize.min} and ${event.eligibility.teamSize.max} members`
      });
    }

    // Prepare team members (creator is automatically accepted)
    const members = [
      {
        user: req.user.id,
        status: 'accepted',
        invitedAt: new Date(),
        respondedAt: new Date()
      },
      ...memberUsers.map((user) => ({
        user: user._id,
        status: 'pending',
        invitedAt: new Date()
      }))
    ];

    // Handle mentor if required
    let mentor = {};
    if (event.requiresMentor && mentorEmail) {
      const mentorUser = await User.findOne({
        email: mentorEmail,
        role: { $in: ['staff', 'hod'] }
      });

      if (!mentorUser) {
        return res.status(400).json({ error: 'Mentor email not found' });
      }

      // Check if mentor is already assigned to a team for this event
      const existingMentorTeam = await Team.findOne({
        event: eventId,
        'mentor.user': mentorUser._id
      });

      if (existingMentorTeam) {
        return res.status(400).json({
          error: 'Mentor is already assigned to another team for this event'
        });
      }

      mentor = {
        user: mentorUser._id,
        status: 'pending',
        invitedAt: new Date()
      };
    }

    // Create team
    const newTeam = new Team({
      name,
      event: eventId,
      creator: req.user.id,
      members,
      mentor: event.requiresMentor ? mentor : undefined
    });

    await newTeam.save();

    // Populate the team before sending response
    await newTeam.populate([
      { path: 'event', select: 'title' },
      { path: 'creator', select: 'name email' },
      { path: 'members.user', select: 'name email' },
      { path: 'mentor.user', select: 'name email' }
    ]);

    res.status(201).json(newTeam);
  } catch (err) {
    console.error('Team creation error:', err);
    res.status(500).json({ error: 'Team creation failed' });
  }
};

// @desc    Get team details
// @route   GET /api/teams/:teamId
exports.getTeamDetails = async (req, res) => {
  try {
    const team = await Team.findById(req.params.teamId)
      .populate('event')
      .populate('creator', 'name email')
      .populate('members.user', 'name email')
      .populate('mentor.user', 'name email');

    if (!team) {
      return res.status(404).json({ error: 'Team not found' });
    }

    // Allow access to team members, mentor, and admins
    const isMember = team.members.some((m) => m.user._id.equals(req.user.id));
    const isMentor = team.mentor?.user?._id.equals(req.user.id);
    const isCreator = team.creator._id.equals(req.user.id);
    const isAdmin = ['innovation', 'principal'].includes(req.user.role);

    if (!isMember && !isMentor && !isCreator && !isAdmin) {
      return res.status(403).json({ error: 'Unauthorized access' });
    }

    res.json(team);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch team details' });
  }
};

// @desc    Respond to team invitation
// @route   POST /api/teams/:teamId/respond
exports.respondToInvitation = async (req, res) => {
  try {
    const { response } = req.body; // 'accepted' or 'rejected'
    const team = await Team.findById(req.params.teamId);

    if (!team) {
      return res.status(404).json({ error: 'Team not found' });
    }

    // Check if user is invited as member
    const memberIndex = team.members.findIndex((m) =>
      m.user.equals(req.user.id)
    );
    if (memberIndex !== -1) {
      if (team.members[memberIndex].status !== 'pending') {
        return res
          .status(400)
          .json({ error: 'Invitation already responded to' });
      }

      team.members[memberIndex].status = response;
      team.members[memberIndex].respondedAt = new Date();
    }
    // Check if user is invited as mentor
    else if (team.mentor?.user?.equals(req.user.id)) {
      if (team.mentor.status !== 'pending') {
        return res
          .status(400)
          .json({ error: 'Invitation already responded to' });
      }

      team.mentor.status = response;
      team.mentor.respondedAt = new Date();
    } else {
      return res
        .status(403)
        .json({ error: 'You are not invited to this team' });
    }

    // Update team status if all members accepted
    if (team.isReadyForRegistration) {
      team.status = 'ready';
    }

    await team.save();

    await team.populate([
      { path: 'event', select: 'title' },
      { path: 'creator', select: 'name email' },
      { path: 'members.user', select: 'name email' },
      { path: 'mentor.user', select: 'name email' }
    ]);

    res.json(team);
  } catch (err) {
    console.error('Response error:', err);
    res.status(500).json({ error: 'Failed to respond to invitation' });
  }
};

// @desc    Get user's team invitations
// @route   GET /api/teams/invitations
exports.getUserInvitations = async (req, res) => {
  try {
    const teams = await Team.find({
      $and: [
        {
          $or: [
            { 'members.user': req.user.id, 'members.status': 'pending' },
            { 'mentor.user': req.user.id, 'mentor.status': 'pending' }
          ]
        },
        { creator: { $ne: req.user.id } } // Exclude teams created by the user
      ]
    })
      .populate('event', 'title startDate')
      .populate('creator', 'name email')
      .populate('members.user', 'name email')
      .populate('mentor.user', 'name email');

    res.json(teams);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch invitations' });
  }
};

// @desc    Get user's teams
// @route   GET /api/teams/my-teams
exports.getUserTeams = async (req, res) => {
  try {
    const teams = await Team.find({
      $or: [
        { creator: req.user.id },
        { 'members.user': req.user.id },
        { 'mentor.user': req.user.id }
      ]
    })
      .populate('event', 'title startDate')
      .populate('creator', 'name email')
      .populate('members.user', 'name email')
      .populate('mentor.user', 'name email');

    res.json(teams);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch teams' });
  }
};

// @desc    Get available users for team creation
// @route   GET /api/teams/available-users/:eventId
exports.getAvailableUsers = async (req, res) => {
  try {
    const { eventId } = req.params;

    // Get users already in teams for this event
    const existingTeams = await Team.find({ event: eventId });
    const usedUserIds = new Set();

    existingTeams.forEach((team) => {
      team.members.forEach((member) => usedUserIds.add(member.user.toString()));
      if (team.mentor?.user) {
        usedUserIds.add(team.mentor.user.toString());
      }
    });

    // Get available students
    const availableStudents = await User.find({
      _id: { $nin: Array.from(usedUserIds) },
      role: 'student'
    }).select('name email department year');

    // Get available staff/mentors
    const availableStaff = await User.find({
      _id: { $nin: Array.from(usedUserIds) },
      role: { $in: ['staff', 'hod'] }
    }).select('name email department');

    res.json({
      students: availableStudents,
      staff: availableStaff
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch available users' });
  }
};

// @desc    Submit proofs for team
// @route   POST /api/teams/submit-proofs/:teamId
exports.submitProofs = async (req, res) => {
  try {
    const team = await Team.findById(req.params.teamId);

    // Only team creator can submit proofs
    const isCreator = team.creator.equals(req.user.id);
    if (!isCreator) {
      return res
        .status(403)
        .json({ error: 'Only team creator can submit proofs' });
    }

    team.proofs = [...team.proofs, ...req.body.fileIds]; // Array of file IDs from upload
    team.verificationStatus = 'pending';
    await team.save();

    res.json(team);
  } catch (err) {
    res.status(500).json({ error: 'Proof submission failed' });
  }
};
