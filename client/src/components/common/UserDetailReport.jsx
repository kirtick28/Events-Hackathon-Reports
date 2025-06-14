import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowLeftIcon,
  UserIcon,
  EnvelopeIcon,
  PhoneIcon,
  AcademicCapIcon,
  CalendarIcon,
  TrophyIcon,
  UserGroupIcon,
  ClockIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';
import {
  StatsCard,
  BarChart,
  PieChart,
  LineChart,
  RecentActivity
} from '../reports';
import api from '../../utils/api';

const UserDetailReport = ({ basePath = '' }) => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [reportData, setReportData] = useState(null);

  useEffect(() => {
    fetchUserReport();
  }, [userId]);

  const fetchUserReport = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/reports/users/${userId}`);
      setReportData(response.data);
    } catch (error) {
      console.error('Failed to fetch user report:', error);
      setReportData(null);
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    navigate(`${basePath}/reports`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading user report...</p>
        </div>
      </div>
    );
  }

  if (!reportData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-6 flex items-center justify-center">
        <div className="text-center">
          <UserIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-800 mb-2">
            User Not Found
          </h3>
          <p className="text-gray-600 mb-4">
            The requested user report could not be found.
          </p>
          <button
            onClick={handleBack}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            Back to Reports
          </button>
        </div>
      </div>
    );
  }

  const {
    user,
    stats,
    teams,
    createdEvents,
    eventTypeParticipation,
    monthlyTrend
  } = reportData;

  const statsCards = [
    {
      title: 'Total Participations',
      value: stats.totalParticipations.toString(),
      change: '+15%',
      trend: 'up',
      icon: CalendarIcon
    },
    {
      title: 'Completed Events',
      value: stats.completedEvents.toString(),
      change: '+20%',
      trend: 'up',
      icon: CheckCircleIcon
    },
    {
      title: 'Ongoing Events',
      value: stats.ongoingEvents.toString(),
      change: '+5%',
      trend: 'up',
      icon: ClockIcon
    },
    {
      title: 'Achievements',
      value: stats.achievements.toString(),
      change: '+25%',
      trend: 'up',
      icon: TrophyIcon
    }
  ];

  // Add created events stat for staff/faculty
  if (user.role === 'staff' || user.role === 'innovation') {
    statsCards.push({
      title: 'Created Events',
      value: stats.createdEvents.toString(),
      change: '+10%',
      trend: 'up',
      icon: CalendarIcon
    });
  }

  const getRoleBadge = (role) => {
    const colors = {
      student: 'bg-blue-100 text-blue-800',
      staff: 'bg-green-100 text-green-800',
      innovation: 'bg-purple-100 text-purple-800',
      hod: 'bg-orange-100 text-orange-800',
      principal: 'bg-red-100 text-red-800'
    };

    return (
      <span
        className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${
          colors[role] || 'bg-gray-100 text-gray-800'
        }`}
      >
        {role?.charAt(0).toUpperCase() + role?.slice(1) || 'Unknown'}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-6"
        >
          <button
            onClick={handleBack}
            className="p-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105"
          >
            <ArrowLeftIcon className="h-6 w-6" />
          </button>
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              User Analytics Report
            </h1>
            <p className="text-gray-600 text-lg mt-1">
              Comprehensive performance metrics and detailed insights
            </p>
          </div>
        </motion.div>

        {/* User Profile Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-lg overflow-hidden"
        >
          <div className="bg-gradient-to-r from-blue-500 to-indigo-600 px-8 py-12 text-white">
            <div className="flex items-center space-x-6">
              <div className="h-24 w-24 bg-white/20 rounded-full flex items-center justify-center">
                <UserIcon className="h-12 w-12" />
              </div>
              <div>
                <h2 className="text-3xl font-bold">{user.name}</h2>
                <div className="flex items-center gap-3 mt-2">
                  {getRoleBadge(user.role)}
                  <span className="text-blue-100">{user.rollNumber}</span>
                </div>
                <p className="text-blue-200 mt-1">
                  {user.department?.name} • {user.class?.name}
                </p>
              </div>
            </div>
          </div>

          <div className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="flex items-center space-x-3">
                <EnvelopeIcon className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="font-medium">{user.email}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <PhoneIcon className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">Phone</p>
                  <p className="font-medium">{user.phone || 'Not provided'}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <CalendarIcon className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">Joined</p>
                  <p className="font-medium">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {statsCards.map((stat, index) => (
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

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Participation Trend */}
          <motion.div
            className="bg-white rounded-xl shadow-sm p-6 lg:col-span-2"
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Participation Trend (Last 6 Months)
            </h2>
            <LineChart data={monthlyTrend} height={300} />
          </motion.div>

          {/* Event Type Participation */}
          <motion.div
            className="bg-white rounded-xl shadow-sm p-6"
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Event Type Participation
            </h2>
            <PieChart data={eventTypeParticipation} height={250} />
            <div className="mt-4 space-y-2">
              {eventTypeParticipation.map((type) => (
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

        {/* Teams and Events */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Teams */}
          <motion.div
            className="bg-white rounded-xl shadow-sm p-6"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Recent Teams ({teams.length})
            </h2>
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {teams.slice(0, 10).map((team) => (
                <div key={team._id} className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium text-gray-900">{team.name}</h3>
                    <span className="text-sm text-gray-500">
                      {team.members.length} members
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">
                    Event: {team.event?.title || 'Unknown Event'}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">
                      {new Date(team.createdAt).toLocaleDateString()}
                    </span>
                    {team.achievements?.length > 0 && (
                      <TrophyIcon className="h-4 w-4 text-yellow-500" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Created Events (for staff/faculty) */}
          {(user.role === 'staff' || user.role === 'innovation') && (
            <motion.div
              className="bg-white rounded-xl shadow-sm p-6"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Created Events ({createdEvents.length})
              </h2>
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {createdEvents.slice(0, 10).map((event) => (
                  <div key={event._id} className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-medium text-gray-900">
                        {event.title}
                      </h3>
                      <span
                        className={`text-xs px-2 py-1 rounded-full ${
                          event.status === 'approved'
                            ? 'bg-green-100 text-green-800'
                            : event.status === 'pending'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {event.status}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">
                      Type:{' '}
                      {event.type?.charAt(0).toUpperCase() +
                        event.type?.slice(1)}
                    </p>
                    <div className="text-xs text-gray-500">
                      {new Date(event.startDate).toLocaleDateString()}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserDetailReport;
