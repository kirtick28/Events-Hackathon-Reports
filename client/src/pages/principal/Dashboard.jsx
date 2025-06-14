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
  StarIcon,
  BuildingOfficeIcon
} from '@heroicons/react/24/outline';
import {
  StatsCard,
  BarChart,
  PieChart,
  RecentActivity,
  ProgressChart
} from '../../components/reports';
import api from '../../utils/api';

const Dashboard = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState({
    stats: [],
    departmentStats: [],
    eventTypeData: [],
    monthlyEventData: [],
    activities: []
  });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const response = await api.get('/dashboard/principal');
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
          title: 'Total Staff',
          value: data.stats.totalStaff.toString(),
          change: '+3%',
          trend: 'up',
          icon: UsersIcon
        },
        {
          title: 'Active Events',
          value: data.stats.activeEvents.toString(),
          change: '+12%',
          trend: 'up',
          icon: CalendarIcon
        },
        {
          title: 'Departments',
          value: data.stats.totalDepartments.toString(),
          change: '0%',
          trend: 'neutral',
          icon: BuildingOfficeIcon
        },
        {
          title: 'Total Participants',
          value: data.stats.totalParticipants.toLocaleString(),
          change: '+15%',
          trend: 'up',
          icon: UserGroupIcon
        },
        {
          title: 'College Rating',
          value: '4.8/5',
          change: '+0.2',
          trend: 'up',
          icon: StarIcon
        }
      ];

      setDashboardData({
        stats: statsData,
        departmentStats: data.departmentStats || [],
        eventTypeData: data.eventTypeData || [],
        monthlyEventData: data.monthlyEventData || [],
        activities: data.activities || []
      });
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
      // Fallback to default data
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
            title: 'Total Staff',
            value: '0',
            change: '+0%',
            trend: 'neutral',
            icon: UsersIcon
          },
          {
            title: 'Active Events',
            value: '0',
            change: '+0%',
            trend: 'neutral',
            icon: CalendarIcon
          },
          {
            title: 'Departments',
            value: '0',
            change: '+0%',
            trend: 'neutral',
            icon: BuildingOfficeIcon
          },
          {
            title: 'Total Participants',
            value: '0',
            change: '+0%',
            trend: 'neutral',
            icon: UserGroupIcon
          },
          {
            title: 'College Rating',
            value: '4.8/5',
            change: '+0%',
            trend: 'neutral',
            icon: StarIcon
          }
        ],
        departmentStats: [],
        eventTypeData: [],
        monthlyEventData: [],
        activities: []
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading principal dashboard...</p>
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
            Principal Dashboard
          </h1>
          <p className="text-gray-500">
            Welcome back, {user?.name || 'Principal'}! Monitor college-wide
            performance and strategic initiatives.
          </p>
        </div>
        <div className="flex items-center space-x-2 text-sm text-gray-500">
          <BuildingOfficeIcon className="h-4 w-4" />
          <span>Sri Eshwar College of Engineering</span>
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
        {/* Department Statistics */}
        <motion.div
          className="bg-white rounded-xl shadow-sm p-6 lg:col-span-2"
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-900">
              Department-wise Overview
            </h2>
            <select className="text-sm border rounded-lg px-3 py-1 bg-gray-50">
              <option>Students</option>
              <option>Staff</option>
              <option>Events</option>
            </select>
          </div>
          <BarChart
            data={dashboardData.departmentStats.map((dept) => ({
              name: dept.name,
              value: dept.students,
              color: dept.color
            }))}
            height={300}
          />
        </motion.div>

        {/* Event Type Distribution */}
        <motion.div
          className="bg-white rounded-xl shadow-sm p-6"
          initial={{ x: 20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Event Distribution
          </h2>
          <PieChart data={dashboardData.eventTypeData} height={250} />
          <div className="mt-4 space-y-2">
            {dashboardData.eventTypeData.map((type) => (
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
            Recent College Activities
          </h2>
          <RecentActivity activities={dashboardData.activities} />
        </motion.div>

        {/* College Performance Metrics */}
        <motion.div
          className="bg-white rounded-xl shadow-sm p-6"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            College Performance
          </h2>
          <ProgressChart
            title="Overall Performance"
            value={92}
            description="Excellent college performance"
            color="green"
          />
          <ProgressChart
            title="Student Satisfaction"
            value={88}
            description="High student satisfaction rate"
            color="blue"
            className="mt-6"
          />
          <ProgressChart
            title="Innovation Index"
            value={85}
            description="Strong innovation culture"
            color="purple"
            className="mt-6"
          />
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Dashboard;
