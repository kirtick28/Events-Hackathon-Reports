import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MagnifyingGlassIcon,
  UserGroupIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon
} from '@heroicons/react/24/outline';
import { format, parseISO } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import api from '../../utils/api';

const TeamManagement = () => {
  const [teams, setTeams] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const response = await api.get('/teams/my-teams');
        setTeams(response.data || []);
      } catch (err) {
        console.error('Failed to fetch teams:', err);
        setTeams([]); // Set empty array on error
      } finally {
        setLoading(false);
      }
    };
    fetchTeams();
  }, []);

  const filteredTeams = teams.filter(
    (team) =>
      team?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      team?.event?.title?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusIcon = (status) => {
    switch (status) {
      case 'accepted':
        return <CheckCircleIcon className="w-4 h-4 text-green-500" />;
      case 'rejected':
        return <XCircleIcon className="w-4 h-4 text-red-500" />;
      default:
        return <ClockIcon className="w-4 h-4 text-yellow-500" />;
    }
  };

  const getTeamStatusColor = (status) => {
    switch (status) {
      case 'ready':
        return 'bg-green-100 text-green-700';
      case 'registered':
        return 'bg-blue-100 text-blue-700';
      case 'verified':
        return 'bg-purple-100 text-purple-700';
      default:
        return 'bg-yellow-100 text-yellow-700';
    }
  };

  const formatDate = (date) => format(parseISO(date), 'dd MMM yyyy');

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your teams...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-between items-center"
        >
          <div>
            <h1 className="text-3xl font-bold text-gray-800">My Teams</h1>
            <p className="text-gray-600 mt-1">
              Manage your teams and track their status
            </p>
          </div>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate('/student/teams/invitations')}
            className="px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition-colors"
          >
            View Invitations
          </motion.button>
        </motion.div>

        {/* Search Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl p-4 shadow-lg"
        >
          <div className="relative">
            <MagnifyingGlassIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search teams by name or event..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400"
            />
          </div>
        </motion.div>

        {/* Teams Grid */}
        <AnimatePresence>
          {filteredTeams.length > 0 ? (
            <motion.div
              layout
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {filteredTeams.map((team, index) => (
                <motion.div
                  key={team._id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow cursor-pointer"
                  onClick={() => navigate(`/student/teams/${team._id}`)}
                >
                  <div className="space-y-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-xl font-semibold text-gray-800">
                          {team.name}
                        </h3>
                        <p className="text-gray-500">{team.event.title}</p>
                        <p className="text-sm text-gray-400">
                          Event Date: {formatDate(team.event.startDate)}
                        </p>
                      </div>
                      <UserGroupIcon className="w-6 h-6 text-gray-400" />
                    </div>

                    <div className="space-y-2">
                      <h4 className="font-medium text-gray-700 flex items-center gap-2">
                        <UserGroupIcon className="w-4 h-4" />
                        Team Members ({team.members.length})
                      </h4>
                      {team.members.slice(0, 3).map((member, memberIndex) => (
                        <div
                          key={memberIndex}
                          className="flex items-center justify-between text-sm"
                        >
                          <span className="truncate">{member.user.name}</span>
                          <div className="flex items-center gap-1">
                            {getStatusIcon(member.status)}
                            <span className="text-xs text-gray-500 capitalize">
                              {member.status}
                            </span>
                          </div>
                        </div>
                      ))}
                      {team.members.length > 3 && (
                        <p className="text-xs text-gray-500">
                          +{team.members.length - 3} more members
                        </p>
                      )}
                    </div>

                    {team.mentor?.user && (
                      <div className="space-y-2">
                        <h4 className="font-medium text-gray-700 text-sm">
                          Mentor
                        </h4>
                        <div className="flex items-center justify-between text-sm">
                          <span className="truncate">
                            {team.mentor.user.name}
                          </span>
                          <div className="flex items-center gap-1">
                            {getStatusIcon(team.mentor.status)}
                            <span className="text-xs text-gray-500 capitalize">
                              {team.mentor.status}
                            </span>
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getTeamStatusColor(
                          team.status
                        )}`}
                      >
                        {team.status.charAt(0).toUpperCase() +
                          team.status.slice(1)}
                      </span>
                      {team.isReadyForRegistration &&
                        team.status === 'forming' && (
                          <span className="text-xs text-green-600 font-medium">
                            Ready to Register!
                          </span>
                        )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12 bg-white rounded-2xl shadow-lg"
            >
              <UserGroupIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-medium text-gray-700 mb-2">
                No Teams Found
              </h3>
              <p className="text-gray-500 mb-6">
                {searchTerm
                  ? 'No teams match your search criteria.'
                  : "You haven't created or joined any teams yet."}
              </p>
              {!searchTerm && (
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => navigate('/student/events')}
                  className="px-6 py-3 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition-colors"
                >
                  Browse Events
                </motion.button>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default TeamManagement;
