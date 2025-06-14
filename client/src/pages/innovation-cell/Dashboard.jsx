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
  FireIcon,
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

const Dashboard = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState({
    stats: [],
    events: [],
    students: [],
    departments: [],
    activities: [],
    participation: []
  });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const response = await api.get('/dashboard/innovation');
      const data = response.data;

      const statsData = [
        {
          title: 'Total Students',
          value: data.stats.totalStudents.toLocaleString(),
          change: '+8%',
          trend: 'up',
          icon: AcademicCapIcon
        },
        {
          title: 'Active Events',
          value: data.stats.activeEvents.toString(),
          change: '+12%',
          trend: 'up',
          icon: CalendarIcon
        },
        {
          title: 'Total Participants',
          value: data.stats.totalParticipants.toLocaleString(),
          change: '+15%',
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
          title: 'Pending Approvals',
          value: data.stats.pendingApprovals.toString(),
          change: '-5%',
          trend: 'down',
          icon: ExclamationCircleIcon
        },
        {
          title: 'Success Rate',
          value: `${data.stats.successRate}%`,
          change: '+2%',
          trend: 'up',
          icon: TrophyIcon
        }
      ];

      setDashboardData({
        stats: statsData,
        events: [],
        students: [],
        departments: data.departmentData || [],
        activities: data.activities || [],
        eventTypes: data.eventTypeData || []
      });
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
      // Fallback to empty data
      setDashboardData({
        stats: [
          {
            title: 'Total Students',
            value: '0',
            change: '+0%',
            trend: 'neutral',
            icon: AcademicCapIcon
          },
          {
            title: 'Active Events',
            value: '0',
            change: '+0%',
            trend: 'neutral',
            icon: CalendarIcon
          },
          {
            title: 'Total Participants',
            value: '0',
            change: '+0%',
            trend: 'neutral',
            icon: UserGroupIcon
          },
          {
            title: 'Completed Events',
            value: '0',
            change: '+0%',
            trend: 'neutral',
            icon: CheckCircleIcon
          },
          {
            title: 'Pending Approvals',
            value: '0',
            change: '+0%',
            trend: 'neutral',
            icon: ExclamationCircleIcon
          },
          {
            title: 'Success Rate',
            value: '0%',
            change: '+0%',
            trend: 'neutral',
            icon: TrophyIcon
          }
        ],
        events: [],
        students: [],
        departments: [],
        activities: [],
        eventTypes: []
      });
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

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
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
            Innovation Cell Dashboard
          </h1>
          <p className="text-gray-500">
            Welcome back, {user?.name || 'Innovation Cell'}! Monitor
            college-wide innovation activities.
          </p>
        </div>
        <div className="flex items-center space-x-2 text-sm text-gray-500">
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
        {/* Department Distribution */}
        <motion.div
          className="bg-white rounded-xl shadow-sm p-6 lg:col-span-2"
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-900">
              Department-wise Student Distribution
            </h2>
            <select className="text-sm border rounded-lg px-3 py-1 bg-gray-50">
              <option>Current Academic Year</option>
              <option>Last Academic Year</option>
            </select>
          </div>
          <BarChart data={dashboardData.departments} height={300} />
        </motion.div>

        {/* Event Type Breakdown */}
        <motion.div
          className="bg-white rounded-xl shadow-sm p-6"
          initial={{ x: 20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Event Type Distribution
          </h2>
          <PieChart data={dashboardData.eventTypes} height={250} />
          <div className="mt-4 space-y-2">
            {dashboardData.eventTypes?.map((type) => (
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
            Recent Innovation Activities
          </h2>
          <RecentActivity activities={dashboardData.activities} />
        </motion.div>

        {/* Performance Metrics */}
        <motion.div
          className="bg-white rounded-xl shadow-sm p-6"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Performance Metrics
          </h2>
          <ProgressChart
            title="Event Success Rate"
            value={94}
            description="Events completed successfully"
            color="green"
          />
          <ProgressChart
            title="Student Participation"
            value={78}
            description="Active student engagement"
            color="blue"
            className="mt-6"
          />
          <ProgressChart
            title="Innovation Index"
            value={85}
            description="Overall innovation score"
            color="purple"
            className="mt-6"
          />
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Dashboard;
