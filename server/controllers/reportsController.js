const User = require('../models/User');
const Event = require('../models/Event');
const Team = require('../models/Team');
const Department = require('../models/Department');
const Class = require('../models/Class');

// @desc    Get users for reports (role-based filtering)
// @route   GET /api/reports/users
exports.getReportsUsers = async (req, res) => {
  try {
    console.log('=== REPORTS USERS REQUEST ===');
    console.log('User:', req.user);
    console.log('Query params:', req.query);

    const { role: userRole, department: userDept, class: userClass } = req.user;
    const { search, role, department, page = 1, limit = 20 } = req.query;

    let query = {};
    let populateFields = [
      { path: 'department', select: 'name' },
      { path: 'class', select: 'name' }
    ];

    // Role-based filtering
    if (userRole === 'hod') {
      // HOD can only see users from their department
      query.department = userDept;
    } else if (userRole === 'staff') {
      // Staff advisors can only see students from their class
      const staffClass = await Class.findOne({ advisors: req.user.id });
      if (!staffClass) {
        return res
          .status(403)
          .json({ error: 'Not authorized - not an advisor' });
      }
      query.class = staffClass._id;
      query.role = 'student'; // Staff can only see students
    }
    // Super admin, principal, and innovation cell can see all users
    console.log('Initial query:', query, 'User role:', userRole);

    // Apply additional filters
    if (role && role !== 'all') {
      query.role = role;
    }

    if (department && department !== 'all') {
      query.department = department;
    }

    // For Innovation Cell, only show students, staff, and HOD
    if (userRole === 'innovation') {
      query.role = { $in: ['student', 'staff', 'hod'] };
      // Override role filter if it was set to something else
      if (
        role &&
        role !== 'all' &&
        ['student', 'staff', 'hod'].includes(role)
      ) {
        query.role = role;
      }
    }

    // Search functionality
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { rollNumber: { $regex: search, $options: 'i' } }
      ];
    }

    // Pagination
    const skip = (page - 1) * limit;
    const total = await User.countDocuments(query);

    console.log('Final query:', query);
    console.log('Total users found:', total);

    const users = await User.find(query)
      .populate(populateFields)
      .select('-password')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    console.log('Users returned:', users.length);
    console.log(
      'First user sample:',
      users[0] ? { name: users[0].name, role: users[0].role } : 'No users'
    );

    res.json({
      users,
      pagination: {
        current: parseInt(page),
        pages: Math.ceil(total / limit),
        total,
        hasNext: page * limit < total,
        hasPrev: page > 1
      }
    });
  } catch (error) {
    console.error('Error fetching reports users:', error);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
};

// @desc    Get detailed user report
// @route   GET /api/reports/users/:id
exports.getUserDetailedReport = async (req, res) => {
  try {
    const { role: userRole, department: userDept, class: userClass } = req.user;
    const userId = req.params.id;

    // Get user details
    const user = await User.findById(userId)
      .populate('department', 'name')
      .populate('class', 'name')
      .select('-password');

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Role-based access control
    if (
      userRole === 'hod' &&
      user.department?._id.toString() !== userDept.toString()
    ) {
      return res.status(403).json({ error: 'Access denied' });
    }

    if (userRole === 'staff') {
      const staffClass = await Class.findOne({ advisors: req.user.id });
      if (
        !staffClass ||
        user.class?._id.toString() !== staffClass._id.toString()
      ) {
        return res.status(403).json({ error: 'Access denied' });
      }
    }

    // Get user's teams and participations
    const teams = await Team.find({
      'members.user': userId
    })
      .populate('event', 'title type startDate endDate status')
      .populate('members.user', 'name email')
      .sort({ createdAt: -1 });

    // Get events created by user (if staff/faculty)
    let createdEvents = [];
    if (user.role === 'staff' || user.role === 'innovation') {
      createdEvents = await Event.find({ createdBy: userId })
        .populate('department', 'name')
        .sort({ createdAt: -1 });
    }

    // Calculate statistics
    const totalParticipations = teams.length;
    const completedEvents = teams.filter(
      (team) =>
        team.event &&
        team.event.status === 'approved' &&
        new Date(team.event.endDate) < new Date()
    ).length;
    const ongoingEvents = teams.filter(
      (team) =>
        team.event &&
        team.event.status === 'approved' &&
        new Date(team.event.startDate) <= new Date() &&
        new Date(team.event.endDate) > new Date()
    ).length;
    const upcomingEvents = teams.filter(
      (team) =>
        team.event &&
        team.event.status === 'approved' &&
        new Date(team.event.startDate) > new Date()
    ).length;
    const achievements = teams.filter(
      (team) => team.achievements?.length > 0
    ).length;

    // Event type participation
    const eventTypes = ['hackathon', 'workshop', 'seminar', 'competition'];
    const eventTypeParticipation = eventTypes.map((type) => ({
      name: type.charAt(0).toUpperCase() + type.slice(1) + 's',
      value: teams.filter((team) => team.event?.type === type).length,
      color: getEventTypeColor(type)
    }));

    // Monthly participation trend (last 6 months)
    const monthlyData = [];
    for (let i = 5; i >= 0; i--) {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      const monthName = date.toLocaleDateString('en-US', { month: 'short' });

      const monthTeams = teams.filter((team) => {
        if (!team.createdAt) return false;
        const teamDate = new Date(team.createdAt);
        return (
          teamDate.getMonth() === date.getMonth() &&
          teamDate.getFullYear() === date.getFullYear()
        );
      });

      monthlyData.push({
        name: monthName,
        value: monthTeams.length
      });
    }

    res.json({
      user,
      stats: {
        totalParticipations,
        completedEvents,
        ongoingEvents,
        upcomingEvents,
        achievements,
        createdEvents: createdEvents.length
      },
      teams,
      createdEvents,
      eventTypeParticipation,
      monthlyTrend: monthlyData
    });
  } catch (error) {
    console.error('Error fetching user detailed report:', error);
    res.status(500).json({ error: 'Failed to fetch user report' });
  }
};

// @desc    Get departments for filter dropdown
// @route   GET /api/reports/departments
exports.getReportsDepartments = async (req, res) => {
  try {
    console.log('=== REPORTS DEPARTMENTS REQUEST ===');
    console.log('User:', req.user);

    const { role: userRole, department: userDept } = req.user;

    let query = {};

    // Role-based filtering
    if (userRole === 'hod') {
      query._id = userDept;
    }

    console.log('Departments query:', query);
    const departments = await Department.find(query).select('name');
    console.log('Departments found:', departments.length);

    res.json(departments);
  } catch (error) {
    console.error('Error fetching departments:', error);
    res.status(500).json({ error: 'Failed to fetch departments' });
  }
};

// Helper function to get event type colors
const getEventTypeColor = (type) => {
  const colors = {
    hackathon: '#6366f1',
    workshop: '#8b5cf6',
    seminar: '#ec4899',
    competition: '#f43f5e'
  };
  return colors[type] || '#6b7280';
};
