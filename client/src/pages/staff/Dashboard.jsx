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
  StarIcon,
  BookOpenIcon
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

const Dashboard = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState({
    stats: [],
    students: [],
    events: [],
    teams: [],
    activities: [],
    performance: []
  });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      // Check if user is an advisor and fetch dashboard data
      if (user?.isAdvisor) {
        const response = await api.get('/dashboard/staff');
        const data = response.data;

        const statsData = [
          {
            title: 'Class Students',
            value: data.stats.classStudents.toString(),
            change: '+3%',
            trend: 'up',
            icon: AcademicCapIcon
          },
          {
            title: 'Active Participants',
            value: data.stats.activeParticipants.toString(),
            change: '+12%',
            trend: 'up',
            icon: UserGroupIcon
          },
          {
            title: 'Total Participations',
            value: data.stats.totalParticipations.toString(),
            change: '+18%',
            trend: 'up',
            icon: CalendarIcon
          },
          {
            title: 'Mentored Teams',
            value: data.stats.mentoredTeams.toString(),
            change: '+8%',
            trend: 'up',
            icon: UsersIcon
          },
          {
            title: 'Winning Teams',
            value: data.stats.winningTeams.toString(),
            change: '+25%',
            trend: 'up',
            icon: TrophyIcon
          },
          {
            title: 'Success Rate',
            value: `${data.stats.successRate}%`,
            change: '+5%',
            trend: 'up',
            icon: StarIcon
          }
        ];

        setDashboardData({
          stats: statsData,
          students: [],
          events: [],
          teams: [],
          activities: data.activities || [],
          performance: data.performanceData || [],
          eventParticipation: data.eventTypeData || [],
          classInfo: data.classInfo
        });
      } else {
        // For non-advisor staff, show limited dashboard
        const statsData = [
          {
            title: 'Mentored Teams',
            value: '0',
            change: '0%',
            trend: 'neutral',
            icon: UserGroupIcon
          },
          {
            title: 'Events Participated',
            value: '0',
            change: '0%',
            trend: 'neutral',
            icon: CalendarIcon
          }
        ];

        setDashboardData({
          stats: statsData,
          students: [],
          events: [],
          teams: [],
          activities: [],
          performance: [],
          eventParticipation: []
        });
      }
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading advisor dashboard...</p>
        </div>
      </div>
    );
  }

  // Non-advisor staff view
  if (!user?.isAdvisor) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="p-6 space-y-8"
      >
        <div className="text-center py-16">
          <BookOpenIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-semibold text-gray-700 mb-2">
            Staff Dashboard
          </h2>
          <p className="text-gray-500 mb-6">
            Welcome, {user?.name}! This dashboard is available for class
            advisors.
          </p>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 max-w-md mx-auto">
            <p className="text-blue-800 text-sm">
              If you are a class advisor, please contact the administrator to
              update your advisor status.
            </p>
          </div>
        </div>
      </motion.div>
    );
  }

  // Advisor dashboard view
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
            Class Advisor Dashboard
          </h1>
          <p className="text-gray-500">
            Welcome back, {user?.name}! Monitor your class students' performance
            and activities.
          </p>
        </div>
        <div className="flex items-center space-x-2 text-sm text-gray-500">
          <AcademicCapIcon className="h-4 w-4" />
          <span>Class: {dashboardData.classInfo?.name || 'Not Assigned'}</span>
          <span>•</span>
          <span>
            Department: {dashboardData.classInfo?.department || 'N/A'}
          </span>
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
        {/* Student Performance */}
        <motion.div
          className="bg-white rounded-xl shadow-sm p-6 lg:col-span-2"
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-900">
              Student Performance Distribution
            </h2>
            <select className="text-sm border rounded-lg px-3 py-1 bg-gray-50">
              <option>Current Semester</option>
              <option>Last Semester</option>
            </select>
          </div>
          <BarChart data={dashboardData.performance} height={300} />
        </motion.div>

        {/* Event Participation */}
        <motion.div
          className="bg-white rounded-xl shadow-sm p-6"
          initial={{ x: 20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Event Participation by Type
          </h2>
          <PieChart data={dashboardData.eventParticipation} height={250} />
          <div className="mt-4 space-y-2">
            {dashboardData.eventParticipation?.map((type) => (
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
                <span className="font-medium">{type.value} students</span>
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
            Recent Class Activities
          </h2>
          <RecentActivity activities={dashboardData.activities} />
        </motion.div>

        {/* Class Performance Metrics */}
        <motion.div
          className="bg-white rounded-xl shadow-sm p-6"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Class Performance Metrics
          </h2>
          <ProgressChart
            title="Attendance Rate"
            value={92}
            description="Average class attendance"
            color="green"
          />
          <ProgressChart
            title="Event Participation"
            value={78}
            description="Students actively participating"
            color="blue"
            className="mt-6"
          />
          <ProgressChart
            title="Academic Performance"
            value={85}
            description="Overall class performance"
            color="purple"
            className="mt-6"
          />
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Dashboard;
