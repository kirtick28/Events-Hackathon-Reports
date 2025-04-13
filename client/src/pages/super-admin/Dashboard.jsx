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
  ExclamationCircleIcon
} from '@heroicons/react/24/outline';
import {
  StatsCard,
  BarChart,
  PieChart,
  RecentActivity,
  ProgressChart
} from '../../components/reports';

const SuperAdminDashboard = () => {
  const { user } = useAuth();

  // Sample data - replace with real API calls
  const statsData = [
    {
      title: 'Total Users',
      value: '2,458',
      change: '+12%',
      trend: 'up',
      icon: UsersIcon
    },
    {
      title: 'Active Students',
      value: '1,892',
      change: '+8%',
      trend: 'up',
      icon: AcademicCapIcon
    },
    {
      title: 'Faculty Members',
      value: '156',
      change: '+3%',
      trend: 'up',
      icon: UsersIcon
    },
    {
      title: 'Pending Approvals',
      value: '24',
      change: '-5%',
      trend: 'down',
      icon: ExclamationCircleIcon
    },
    {
      title: 'Active Events',
      value: '18',
      change: '0%',
      trend: 'neutral',
      icon: CalendarIcon
    },
    {
      title: 'Completed Tasks',
      value: '89%',
      change: '+4%',
      trend: 'up',
      icon: CheckCircleIcon
    }
  ];

  const userDistributionData = [
    { name: 'Students', value: 1892, color: '#4f46e5' },
    { name: 'Faculty', value: 156, color: '#10b981' },
    { name: 'Staff', value: 120, color: '#f59e0b' },
    { name: 'Admins', value: 12, color: '#ef4444' }
  ];

  const departmentData = [
    { name: 'CSE', value: 620, color: '#6366f1' },
    { name: 'ECE', value: 480, color: '#8b5cf6' },
    { name: 'MECH', value: 380, color: '#ec4899' },
    { name: 'CIVIL', value: 290, color: '#f43f5e' },
    { name: 'AIML', value: 210, color: '#f97316' }
  ];

  const recentActivities = [
    {
      id: 1,
      user: 'Dr. Smith',
      action: 'added new course',
      time: '5 mins ago',
      icon: DocumentTextIcon
    },
    {
      id: 2,
      user: 'John Doe',
      action: 'registered for event',
      time: '12 mins ago',
      icon: CalendarIcon
    },
    {
      id: 3,
      user: 'System',
      action: 'completed nightly backup',
      time: '1 hour ago',
      icon: CheckCircleIcon
    },
    {
      id: 4,
      user: 'Admin',
      action: 'updated user permissions',
      time: '2 hours ago',
      icon: UsersIcon
    }
  ];

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
            Dashboard Overview
          </h1>
          <p className="text-gray-500">
            Welcome back, {user?.name || 'Admin'}!
          </p>
        </div>
        <div className="flex items-center space-x-2 text-sm text-gray-500">
          <ClockIcon className="h-4 w-4" />
          <span>Last updated: {new Date().toLocaleString()}</span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
        {statsData.map((stat, index) => (
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
        {/* User Distribution */}
        <motion.div
          className="bg-white rounded-xl shadow-sm p-6 lg:col-span-2"
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-900">
              User Distribution
            </h2>
            <select className="text-sm border rounded-lg px-3 py-1 bg-gray-50">
              <option>This Month</option>
              <option>Last Month</option>
              <option>This Year</option>
            </select>
          </div>
          <BarChart data={userDistributionData} height={300} />
        </motion.div>

        {/* Department Breakdown */}
        <motion.div
          className="bg-white rounded-xl shadow-sm p-6"
          initial={{ x: 20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Department Breakdown
          </h2>
          <PieChart data={departmentData} height={250} />
          <div className="mt-4 space-y-2">
            {departmentData.map((dept) => (
              <div
                key={dept.name}
                className="flex items-center justify-between text-sm"
              >
                <div className="flex items-center">
                  <div
                    className="h-3 w-3 rounded-full mr-2"
                    style={{ backgroundColor: dept.color }}
                  />
                  <span>{dept.name}</span>
                </div>
                <span className="font-medium">{dept.value} users</span>
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
            Recent Activity
          </h2>
          <RecentActivity activities={recentActivities} />
        </motion.div>

        {/* System Status */}
        <motion.div
          className="bg-white rounded-xl shadow-sm p-6"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            System Status
          </h2>
          <ProgressChart
            title="Storage Usage"
            value={75}
            description="45.2 GB of 60 GB used"
            color="indigo"
          />
          <ProgressChart
            title="Database Health"
            value={92}
            description="Optimal performance"
            color="green"
            className="mt-6"
          />
          <ProgressChart
            title="Uptime"
            value={99.9}
            description="Last restart: 30 days ago"
            color="blue"
            className="mt-6"
          />
        </motion.div>
      </div>
    </motion.div>
  );
};

export default SuperAdminDashboard;
