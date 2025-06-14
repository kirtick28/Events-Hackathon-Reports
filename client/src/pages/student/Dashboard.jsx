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
  BookOpenIcon,
  FireIcon
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
    events: [],
    teams: [],
    activities: [],
    achievements: [],
    participation: []
  });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      // Fetch student dashboard data from API
      const response = await api.get('/dashboard/student');
      const data = response.data;

      const statsData = [
        {
          title: 'Total Participations',
          value: data.stats.totalParticipations.toString(),
          change: '+15%',
          trend: 'up',
          icon: CalendarIcon
        },
        {
          title: 'Active Teams',
          value: data.stats.activeTeams.toString(),
          change: '+8%',
          trend: 'up',
          icon: UserGroupIcon
        },
        {
          title: 'Completed Events',
          value: data.stats.completedEvents.toString(),
          change: '+20%',
          trend: 'up',
          icon: CheckCircleIcon
        },
        {
          title: 'Ongoing Events',
          value: data.stats.ongoingEvents.toString(),
          change: '+5%',
          trend: 'up',
          icon: ClockIcon
        },
        {
          title: 'Achievements',
          value: data.stats.achievements.toString(),
          change: '+25%',
          trend: 'up',
          icon: TrophyIcon
        },
        {
          title: 'Success Rate',
          value: `${data.stats.successRate}%`,
          change: '+10%',
          trend: 'up',
          icon: StarIcon
        }
      ];

      setDashboardData({
        stats: statsData,
        events: [],
        teams: data.teams || [],
        activities: data.activities || [],
        eventTypeParticipation: data.eventTypeParticipation || [],
        monthlyTrend: data.monthlyTrend || []
      });
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
      // Fallback to mock data if API fails
      setDashboardData({
        stats: [
          {
            title: 'Total Participations',
            value: '0',
            change: '+0%',
            trend: 'up',
            icon: CalendarIcon
          },
          {
            title: 'Active Teams',
            value: '0',
            change: '+0%',
            trend: 'up',
            icon: UserGroupIcon
          },
          {
            title: 'Completed Events',
            value: '0',
            change: '+0%',
            trend: 'up',
            icon: CheckCircleIcon
          },
          {
            title: 'Ongoing Events',
            value: '0',
            change: '+0%',
            trend: 'up',
            icon: ClockIcon
          },
          {
            title: 'Achievements',
            value: '0',
            change: '+0%',
            trend: 'up',
            icon: TrophyIcon
          },
          {
            title: 'Success Rate',
            value: '0%',
            change: '+0%',
            trend: 'up',
            icon: StarIcon
          }
        ],
        events: [],
        teams: [],
        activities: [],
        eventTypeParticipation: [],
        monthlyTrend: []
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0"
        >
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Dashboard</h1>
            <p className="text-gray-500">
              Welcome back, {user?.name}! Track your innovation journey and
              achievements.
            </p>
          </div>
          <div className="flex items-center space-x-2 text-sm text-gray-500">
            <AcademicCapIcon className="h-4 w-4" />
            <span>
              {user?.department?.name || 'Student'} • {user?.class || 'Class'}
            </span>
            <span>•</span>
            <ClockIcon className="h-4 w-4" />
            <span>Last updated: {new Date().toLocaleString()}</span>
          </div>
        </motion.div>

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
          {/* Participation Trend */}
          <motion.div
            className="bg-white rounded-xl shadow-sm p-6 lg:col-span-2"
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-gray-900">
                My Participation Trend
              </h2>
              <select className="text-sm border rounded-lg px-3 py-1 bg-gray-50">
                <option>Last 6 Months</option>
                <option>Last Year</option>
              </select>
            </div>
            <LineChart data={dashboardData.monthlyTrend} height={300} />
          </motion.div>

          {/* Event Type Participation */}
          <motion.div
            className="bg-white rounded-xl shadow-sm p-6"
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              My Event Participation
            </h2>
            <PieChart
              data={dashboardData.eventTypeParticipation}
              height={250}
            />
            <div className="mt-4 space-y-2">
              {dashboardData.eventTypeParticipation?.map((type) => (
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
              My Recent Activities
            </h2>
            <RecentActivity activities={dashboardData.activities} />
          </motion.div>

          {/* Personal Performance */}
          <motion.div
            className="bg-white rounded-xl shadow-sm p-6"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              My Performance Metrics
            </h2>
            <ProgressChart
              title="Participation Rate"
              value={85}
              description="Events participated vs available"
              color="green"
            />
            <ProgressChart
              title="Team Collaboration"
              value={92}
              description="Team performance score"
              color="blue"
              className="mt-6"
            />
            <ProgressChart
              title="Innovation Score"
              value={78}
              description="Overall innovation rating"
              color="purple"
              className="mt-6"
            />
          </motion.div>
        </div>

        {/* Quick Actions */}
        <motion.div
          className="bg-white rounded-xl shadow-sm p-6"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Quick Actions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="p-4 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-lg hover:shadow-lg transition-shadow"
              onClick={() => (window.location.href = '/student/events')}
            >
              <CalendarIcon className="h-6 w-6 mx-auto mb-2" />
              <span className="text-sm font-medium">Browse Events</span>
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="p-4 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg hover:shadow-lg transition-shadow"
              onClick={() => (window.location.href = '/student/teams')}
            >
              <UserGroupIcon className="h-6 w-6 mx-auto mb-2" />
              <span className="text-sm font-medium">Manage Teams</span>
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="p-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:shadow-lg transition-shadow"
              onClick={() => (window.location.href = '/student/achievements')}
            >
              <TrophyIcon className="h-6 w-6 mx-auto mb-2" />
              <span className="text-sm font-medium">View Achievements</span>
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="p-4 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg hover:shadow-lg transition-shadow"
              onClick={() => (window.location.href = '/student/profile')}
            >
              <AcademicCapIcon className="h-6 w-6 mx-auto mb-2" />
              <span className="text-sm font-medium">Update Profile</span>
            </motion.button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;
