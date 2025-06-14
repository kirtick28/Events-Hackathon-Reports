import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { motion } from 'framer-motion';
import {
  UsersIcon,
  CalendarIcon,
  AcademicCapIcon,
  ChartBarIcon,
  ClockIcon,
  DocumentTextIcon,
  CheckCircleIcon,
  ExclamationCircleIcon,
  TrophyIcon,
  UserGroupIcon,
  BuildingOfficeIcon,
  StarIcon
} from '@heroicons/react/24/outline';
import {
  StatsCard,
  BarChart,
  PieChart,
  RecentActivity,
  ProgressChart,
  LineChart
} from '../../components/reports';
import api from '../../utils/api';

const HODDashboard = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState({
    stats: [],
    events: [],
    students: [],
    staff: [],
    activities: [],
    performance: []
  });

  useEffect(() => {
    if (user && user.department) {
      fetchDashboardData();
    }
  }, [user]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      // Get department ID (handle both object and string cases)
      const departmentId =
        typeof user.department === 'object'
          ? user.department._id
          : user.department;

      // Fetch department-specific data
      const [eventsRes, studentsRes, staffRes] = await Promise.all([
        api.get(`/events?department=${departmentId}`),
        api.get(`/users?role=student&department=${departmentId}`),
        api.get(`/users?role=staff&department=${departmentId}`)
      ]);

      const events = eventsRes.data || [];
      const students = studentsRes.data || [];
      const staff = staffRes.data || [];

      // Calculate department-specific stats
      const activeEvents = events.filter(
        (e) => e.status === 'approved' && new Date(e.endDate) > new Date()
      ).length;
      const totalParticipants = events.reduce(
        (sum, event) => sum + (event.participants?.length || 0),
        0
      );
      const completedEvents = events.filter(
        (e) => e.status === 'approved' && new Date(e.endDate) < new Date()
      ).length;
      const pendingApprovals = events.filter(
        (e) => e.status === 'pending'
      ).length;
      const activeStaff = staff.filter((s) => s.isActive !== false).length;

      const statsData = [
        {
          title: 'Department Students',
          value: students.length.toLocaleString(),
          change: '+5%',
          trend: 'up',
          icon: AcademicCapIcon
        },
        {
          title: 'Active Staff',
          value: activeStaff.toString(),
          change: '+2%',
          trend: 'up',
          icon: UsersIcon
        },
        {
          title: 'Department Events',
          value: activeEvents.toString(),
          change: '+15%',
          trend: 'up',
          icon: CalendarIcon
        },
        {
          title: 'Student Participation',
          value: totalParticipants.toLocaleString(),
          change: '+18%',
          trend: 'up',
          icon: UserGroupIcon
        },
        {
          title: 'Completed Events',
          value: completedEvents.toString(),
          change: '+25%',
          trend: 'up',
          icon: CheckCircleIcon
        },
        {
          title: 'Pending Approvals',
          value: pendingApprovals.toString(),
          change: '-10%',
          trend: 'down',
          icon: ExclamationCircleIcon
        }
      ];

      // Class-wise student distribution
      const classData = students.reduce((acc, student) => {
        const className = student.class || 'Unassigned';
        acc[className] = (acc[className] || 0) + 1;
        return acc;
      }, {});

      const classDistribution = Object.entries(classData).map(
        ([className, count]) => ({
          name: className,
          value: count,
          color: getRandomColor()
        })
      );

      // Event performance data
      const eventPerformance = [
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

      // Recent department activities
      const recentActivities = [
        {
          id: 1,
          user: 'Dr. Smith',
          action: 'Approved new workshop proposal',
          time: '10 mins ago',
          icon: CheckCircleIcon
        },
        {
          id: 2,
          user: 'Student Team Alpha',
          action: 'Won departmental hackathon',
          time: '1 hour ago',
          icon: TrophyIcon
        },
        {
          id: 3,
          user: 'Prof. Johnson',
          action: 'Created new seminar series',
          time: '2 hours ago',
          icon: DocumentTextIcon
        },
        {
          id: 4,
          user: 'Final Year Students',
          action: 'Registered for placement drive',
          time: '3 hours ago',
          icon: AcademicCapIcon
        }
      ];

      setDashboardData({
        stats: statsData,
        events,
        students,
        staff,
        activities: recentActivities,
        classDistribution,
        eventPerformance
      });
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getRandomColor = () => {
    const colors = [
      '#6366f1',
      '#8b5cf6',
      '#ec4899',
      '#f43f5e',
      '#f97316',
      '#eab308',
      '#22c55e',
      '#06b6d4'
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  if (loading || !user || !user.department) {
    return (
      <div className="p-6 flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">
            {!user ? 'Loading user data...' : 'Loading department dashboard...'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="p-6 space-y-8"
    >
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Department Dashboard
          </h1>
          <p className="text-gray-500">
            Welcome back, {user?.name || 'HOD'}! Monitor your department's
            performance and activities.
          </p>
        </div>
        <div className="flex items-center space-x-2 text-sm text-gray-500">
          <BuildingOfficeIcon className="h-4 w-4" />
          <span>{user?.department?.name || 'Department'}</span>
          <span>•</span>
          <ClockIcon className="h-4 w-4" />
          <span>Last updated: {new Date().toLocaleString()}</span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
        {dashboardData.stats.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: index * 0.1 }}
          >
            <StatsCard
              title={stat.title}
              value={stat.value}
              change={stat.change}
              trend={stat.trend}
              icon={<stat.icon className="h-6 w-6" />}
            />
          </motion.div>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Class Distribution */}
        <motion.div
          className="bg-white rounded-xl shadow-sm p-6 lg:col-span-2"
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-900">
              Class-wise Student Distribution
            </h2>
            <select className="text-sm border rounded-lg px-3 py-1 bg-gray-50">
              <option>Current Academic Year</option>
              <option>Last Academic Year</option>
            </select>
          </div>
          <BarChart data={dashboardData.classDistribution} height={300} />
        </motion.div>

        {/* Event Performance */}
        <motion.div
          className="bg-white rounded-xl shadow-sm p-6"
          initial={{ x: 20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Department Event Types
          </h2>
          <PieChart data={dashboardData.eventPerformance} height={250} />
          <div className="mt-4 space-y-2">
            {dashboardData.eventPerformance?.map((type) => (
              <div
                key={type.name}
                className="flex items-center justify-between text-sm"
              >
                <div className="flex items-center">
                  <div
                    className="h-3 w-3 rounded-full mr-2"
                    style={{ backgroundColor: type.color }}
                  />
                  <span>{type.name}</span>
                </div>
                <span className="font-medium">{type.value} events</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <motion.div
          className="bg-white rounded-xl shadow-sm p-6 lg:col-span-2"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Recent Department Activities
          </h2>
          <RecentActivity activities={dashboardData.activities} />
        </motion.div>

        {/* Department Performance */}
        <motion.div
          className="bg-white rounded-xl shadow-sm p-6"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Department Performance
          </h2>
          <ProgressChart
            title="Student Engagement"
            value={88}
            description="Active participation rate"
            color="green"
          />
          <ProgressChart
            title="Event Success Rate"
            value={92}
            description="Successfully completed events"
            color="blue"
            className="mt-6"
          />
          <ProgressChart
            title="Academic Excellence"
            value={85}
            description="Overall department score"
            color="purple"
            className="mt-6"
          />
        </motion.div>
      </div>
    </motion.div>
  );
};

export default HODDashboard;
