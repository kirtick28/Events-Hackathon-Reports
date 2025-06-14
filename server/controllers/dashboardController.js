const User = require('../models/User');
const Event = require('../models/Event');
const Team = require('../models/Team');
const Department = require('../models/Department');
const Class = require('../models/Class');

// @desc    Get student dashboard data
// @route   GET /api/dashboard/student
exports.getStudentDashboard = async (req, res) => {
  try {
    const studentId = req.user.id;

    // Get student's teams
    const teams = await Team.find({
      'members.user': studentId
    }).populate('event', 'title type startDate endDate');

    // Get student's events (through teams)
    const eventIds = teams.map((team) => team.event._id);
    const events = await Event.find({ _id: { $in: eventIds } });

    // Calculate stats
    const totalParticipations = teams.length;
    const activeTeams = teams.filter(
      (team) => team.event && new Date(team.event.endDate) > new Date()
    ).length;
    const completedEvents = teams.filter(
      (team) => team.event && new Date(team.event.endDate) < new Date()
    ).length;
    const ongoingEvents = teams.filter(
      (team) =>
        team.event &&
        new Date(team.event.startDate) <= new Date() &&
        new Date(team.event.endDate) > new Date()
    ).length;
    const achievements = teams.filter(
      (team) => team.achievements?.length > 0
    ).length;
    const successRate =
      totalParticipations > 0
        ? Math.round((achievements / totalParticipations) * 100)
        : 0;

    // Event type participation
    const eventTypeParticipation = [
      {
        name: 'Hackathons',
        value: events.filter((e) => e.type === 'hackathon').length,
        color: '#6366f1'
      },
      {
        name: 'Workshops',
        value: events.filter((e) => e.type === 'workshop').length,
        color: '#8b5cf6'
      },
      {
        name: 'Seminars',
        value: events.filter((e) => e.type === 'seminar').length,
        color: '#ec4899'
      },
      {
        name: 'Competitions',
        value: events.filter((e) => e.type === 'competition').length,
        color: '#f43f5e'
      }
    ];

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
        value: monthTeams.length,
        color: '#3b82f6'
      });
    }

    // Recent activities
    const recentActivities = teams.slice(0, 4).map((team, index) => ({
      id: index + 1,
      user: 'You',
      action: `Joined team "${team.name}" for ${team.event?.title || 'event'}`,
      time: team.createdAt
        ? new Date(team.createdAt).toLocaleDateString()
        : 'Recently',
      icon: 'UserGroupIcon'
    }));

    res.json({
      stats: {
        totalParticipations,
        activeTeams,
        completedEvents,
        ongoingEvents,
        achievements,
        successRate
      },
      eventTypeParticipation,
      monthlyTrend: monthlyData,
      activities: recentActivities,
      teams
    });
  } catch (error) {
    console.error('Error fetching student dashboard:', error);
    res.status(500).json({ error: 'Failed to fetch dashboard data' });
  }
};

// @desc    Get staff dashboard data
// @route   GET /api/dashboard/staff
exports.getStaffDashboard = async (req, res) => {
  try {
    const staffId = req.user.id;

    // Get staff's class if they are an advisor
    const staffClass = await Class.findOne({ advisors: staffId }).populate(
      'department'
    );

    if (!staffClass) {
      return res.status(403).json({ error: 'Not authorized - not an advisor' });
    }

    // Get class students
    const students = await User.find({
      class: staffClass._id,
      role: 'student'
    });

    // Get teams mentored by this staff
    const mentoredTeams = await Team.find({ mentor: staffId })
      .populate('event', 'title type startDate endDate')
      .populate('members.user', 'name email');

    // Get events where class students participated
    const studentIds = students.map((s) => s._id);
    const studentTeams = await Team.find({
      'members.user': { $in: studentIds }
    }).populate('event', 'title type startDate endDate');

    // Calculate stats
    const classStudents = students.length;
    const activeParticipants = studentTeams.filter(
      (team) => team.event && new Date(team.event.endDate) > new Date()
    ).length;
    const totalParticipations = studentTeams.length;
    const winningTeams = mentoredTeams.filter(
      (team) => team.achievements?.length > 0
    ).length;
    const successRate =
      mentoredTeams.length > 0
        ? Math.round((winningTeams / mentoredTeams.length) * 100)
        : 0;

    // Student performance distribution
    const performanceData = [
      {
        name: 'Excellent',
        value: Math.floor(students.length * 0.2),
        color: '#22c55e'
      },
      {
        name: 'Good',
        value: Math.floor(students.length * 0.4),
        color: '#3b82f6'
      },
      {
        name: 'Average',
        value: Math.floor(students.length * 0.3),
        color: '#f59e0b'
      },
      {
        name: 'Needs Improvement',
        value: Math.floor(students.length * 0.1),
        color: '#ef4444'
      }
    ];

    // Event participation by type
    const events = studentTeams.map((team) => team.event).filter(Boolean);
    const eventTypeData = [
      {
        name: 'Hackathons',
        value: events.filter((e) => e.type === 'hackathon').length,
        color: '#6366f1'
      },
      {
        name: 'Workshops',
        value: events.filter((e) => e.type === 'workshop').length,
        color: '#8b5cf6'
      },
      {
        name: 'Seminars',
        value: events.filter((e) => e.type === 'seminar').length,
        color: '#ec4899'
      },
      {
        name: 'Competitions',
        value: events.filter((e) => e.type === 'competition').length,
        color: '#f43f5e'
      }
    ];

    // Recent activities
    const recentActivities = studentTeams.slice(0, 4).map((team, index) => ({
      id: index + 1,
      user: team.members[0]?.user?.name || 'Student',
      action: `Joined team "${team.name}" for ${team.event?.title || 'event'}`,
      time: team.createdAt
        ? new Date(team.createdAt).toLocaleDateString()
        : 'Recently',
      icon: 'UserGroupIcon'
    }));

    res.json({
      stats: {
        classStudents,
        activeParticipants,
        totalParticipations,
        mentoredTeams: mentoredTeams.length,
        winningTeams,
        successRate
      },
      performanceData,
      eventTypeData,
      activities: recentActivities,
      classInfo: {
        name: staffClass.name,
        department: staffClass.department?.name,
        studentCount: students.length
      }
    });
  } catch (error) {
    console.error('Error fetching staff dashboard:', error);
    res.status(500).json({ error: 'Failed to fetch dashboard data' });
  }
};

// @desc    Get innovation cell dashboard data
// @route   GET /api/dashboard/innovation
exports.getInnovationDashboard = async (req, res) => {
  try {
    // Get all data
    const [students, events, teams, departments, staff] = await Promise.all([
      User.find({ role: 'student' }),
      Event.find(),
      Team.find().populate('event', 'title type'),
      Department.find(),
      User.find({ role: 'staff' })
    ]);

    // Calculate stats
    const totalStudents = students.length;
    const activeEvents = events.filter(
      (e) => e.status === 'approved' && new Date(e.endDate) > new Date()
    ).length;
    const totalParticipants = teams.reduce(
      (sum, team) => sum + team.members.length,
      0
    );
    const completedEvents = events.filter(
      (e) => e.status === 'approved' && new Date(e.endDate) < new Date()
    ).length;
    const pendingApprovals = events.filter(
      (e) => e.status === 'pending'
    ).length;
    const successRate =
      events.length > 0
        ? Math.round((completedEvents / events.length) * 100)
        : 0;

    // Department-wise student distribution
    const departmentData = departments.map((dept) => {
      const deptStudents = students.filter(
        (s) => s.department?.toString() === dept._id.toString()
      );
      return {
        name: dept.name,
        value: deptStudents.length,
        color: `hsl(${Math.random() * 360}, 70%, 50%)`
      };
    });

    // Event type distribution
    const eventTypeData = [
      {
        name: 'Hackathons',
        value: events.filter((e) => e.type === 'hackathon').length,
        color: '#6366f1'
      },
      {
        name: 'Workshops',
        value: events.filter((e) => e.type === 'workshop').length,
        color: '#8b5cf6'
      },
      {
        name: 'Seminars',
        value: events.filter((e) => e.type === 'seminar').length,
        color: '#ec4899'
      },
      {
        name: 'Competitions',
        value: events.filter((e) => e.type === 'competition').length,
        color: '#f43f5e'
      }
    ];

    // Recent activities
    const recentActivities = events.slice(0, 4).map((event, index) => ({
      id: index + 1,
      user: 'Innovation Cell',
      action: `${event.status === 'approved' ? 'Approved' : 'Created'} event "${
        event.title
      }"`,
      time: event.createdAt
        ? new Date(event.createdAt).toLocaleDateString()
        : 'Recently',
      icon: 'CalendarIcon'
    }));

    res.json({
      stats: {
        totalStudents,
        activeEvents,
        totalParticipants,
        completedEvents,
        pendingApprovals,
        successRate
      },
      departmentData,
      eventTypeData,
      activities: recentActivities
    });
  } catch (error) {
    console.error('Error fetching innovation dashboard:', error);
    res.status(500).json({ error: 'Failed to fetch dashboard data' });
  }
};

// @desc    Get super admin dashboard data
// @route   GET /api/dashboard/super-admin
exports.getSuperAdminDashboard = async (req, res) => {
  try {
    // Get all data across the entire system
    const [students, events, teams, departments, staff, classes] =
      await Promise.all([
        User.find({ role: 'student' })
          .populate('department', 'name')
          .populate('class', 'name'),
        Event.find().populate('department', 'name'),
        Team.find().populate('event', 'title type'),
        Department.find(),
        User.find({ role: 'staff' }).populate('department', 'name'),
        Class.find().populate('department', 'name')
      ]);

    // Calculate comprehensive stats
    const totalStudents = students.length;
    const totalStaff = staff.length;
    const totalDepartments = departments.length;
    const totalEvents = events.length;
    const activeEvents = events.filter(
      (e) => e.status === 'approved' && new Date(e.endDate) > new Date()
    ).length;
    const totalParticipants = teams.reduce(
      (sum, team) => sum + team.members.length,
      0
    );
    const completedEvents = events.filter(
      (e) => e.status === 'approved' && new Date(e.endDate) < new Date()
    ).length;
    const pendingApprovals = events.filter(
      (e) => e.status === 'pending'
    ).length;

    // Department-wise statistics
    const departmentStats = departments.map((dept) => {
      const deptStudents = students.filter(
        (s) => s.department?._id.toString() === dept._id.toString()
      );
      const deptStaff = staff.filter(
        (s) => s.department?._id.toString() === dept._id.toString()
      );
      const deptEvents = events.filter(
        (e) => e.department?._id.toString() === dept._id.toString()
      );

      return {
        name: dept.name,
        students: deptStudents.length,
        staff: deptStaff.length,
        events: deptEvents.length,
        color: `hsl(${Math.random() * 360}, 70%, 50%)`
      };
    });

    // Event type distribution
    const eventTypeData = [
      {
        name: 'Hackathons',
        value: events.filter((e) => e.type === 'hackathon').length,
        color: '#6366f1'
      },
      {
        name: 'Workshops',
        value: events.filter((e) => e.type === 'workshop').length,
        color: '#8b5cf6'
      },
      {
        name: 'Seminars',
        value: events.filter((e) => e.type === 'seminar').length,
        color: '#ec4899'
      },
      {
        name: 'Competitions',
        value: events.filter((e) => e.type === 'competition').length,
        color: '#f43f5e'
      }
    ];

    // Monthly event trend (last 6 months)
    const monthlyEventData = [];
    for (let i = 5; i >= 0; i--) {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      const monthName = date.toLocaleDateString('en-US', { month: 'short' });

      const monthEvents = events.filter((event) => {
        if (!event.createdAt) return false;
        const eventDate = new Date(event.createdAt);
        return (
          eventDate.getMonth() === date.getMonth() &&
          eventDate.getFullYear() === date.getFullYear()
        );
      });

      monthlyEventData.push({
        name: monthName,
        value: monthEvents.length,
        color: '#3b82f6'
      });
    }

    // Recent system activities
    const recentActivities = [
      ...events.slice(0, 2).map((event, index) => ({
        id: `event-${index}`,
        user: 'System',
        action: `New event "${event.title}" created`,
        time: event.createdAt
          ? new Date(event.createdAt).toLocaleDateString()
          : 'Recently',
        icon: 'CalendarIcon'
      })),
      ...teams.slice(0, 2).map((team, index) => ({
        id: `team-${index}`,
        user: 'Student',
        action: `Team "${team.name}" formed`,
        time: team.createdAt
          ? new Date(team.createdAt).toLocaleDateString()
          : 'Recently',
        icon: 'UserGroupIcon'
      }))
    ];

    res.json({
      stats: {
        totalStudents,
        totalStaff,
        totalDepartments,
        totalEvents,
        activeEvents,
        totalParticipants,
        completedEvents,
        pendingApprovals
      },
      departmentStats,
      eventTypeData,
      monthlyEventData,
      activities: recentActivities
    });
  } catch (error) {
    console.error('Error fetching super admin dashboard:', error);
    res.status(500).json({ error: 'Failed to fetch dashboard data' });
  }
};

// @desc    Get principal dashboard data (same as super admin but college-specific)
// @route   GET /api/dashboard/principal
exports.getPrincipalDashboard = async (req, res) => {
  try {
    // For now, principal has same access as super admin
    // In future, this could be filtered by college if multi-college system
    return exports.getSuperAdminDashboard(req, res);
  } catch (error) {
    console.error('Error fetching principal dashboard:', error);
    res.status(500).json({ error: 'Failed to fetch dashboard data' });
  }
};

// @desc    Get past participations for student
// @route   GET /api/dashboard/past-participations
exports.getPastParticipations = async (req, res) => {
  try {
    const studentId = req.user.id;

    const teams = await Team.find({
      'members.user': studentId
    })
      .populate('event', 'title type description startDate endDate')
      .populate('members.user', 'name')
      .sort({ createdAt: -1 });

    const participations = teams.map((team) => ({
      id: team._id,
      eventTitle: team.event?.title || 'Unknown Event',
      eventType: team.event?.type || 'unknown',
      teamName: team.name,
      participationDate: team.createdAt,
      status: 'completed',
      result: team.achievements?.length > 0 ? 'winner' : 'participated',
      position: team.achievements?.length > 0 ? 1 : null,
      certificate: team.achievements?.length > 0,
      teamMembers: team.members
        .map((member) => member.user?.name)
        .filter(Boolean),
      description: team.event?.description || 'No description available'
    }));

    res.json(participations);
  } catch (error) {
    console.error('Error fetching past participations:', error);
    res.status(500).json({ error: 'Failed to fetch past participations' });
  }
};
