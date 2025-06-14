import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { format, parseISO } from 'date-fns';
import { 
  UserGroupIcon, 
  CheckCircleIcon, 
  XCircleIcon, 
  ClockIcon,
  ArrowLeftIcon,
  DocumentIcon
} from '@heroicons/react/24/outline';
import api from '../../utils/api';
import { useAuth } from '../../contexts/AuthContext';

const TeamDetails = () => {
  const { teamId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [team, setTeam] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchTeamDetails();
  }, [teamId]);

  const fetchTeamDetails = async () => {
    try {
      const response = await api.get(`/teams/${teamId}`);
      setTeam(response.data);
    } catch (err) {
      console.error('Failed to fetch team details:', err);
      setError('Failed to load team details');
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'accepted':
        return <CheckCircleIcon className="w-5 h-5 text-green-500" />;
      case 'rejected':
        return <XCircleIcon className="w-5 h-5 text-red-500" />;
      default:
        return <ClockIcon className="w-5 h-5 text-yellow-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'accepted':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-yellow-100 text-yellow-800';
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

  const formatDate = (date) => format(parseISO(date), 'dd MMM yyyy, h:mm a');

  const isCreator = team?.creator._id === user.id;
  const userMember = team?.members.find(m => m.user._id === user.id);
  const isMentor = team?.mentor?.user?._id === user.id;

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading team details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-6 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={() => navigate('/student/teams')}
            className="px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600"
          >
            Back to Teams
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-4"
        >
          <button
            onClick={() => navigate('/student/teams')}
            className="p-2 hover:bg-white hover:shadow-md rounded-lg transition-all"
          >
            <ArrowLeftIcon className="w-6 h-6 text-gray-600" />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-gray-800">{team.name}</h1>
            <p className="text-gray-600">Team for: {team.event.title}</p>
          </div>
        </motion.div>

        {/* Team Status */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl p-6 shadow-lg"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-800">Team Status</h2>
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getTeamStatusColor(team.status)}`}>
              {team.status.charAt(0).toUpperCase() + team.status.slice(1)}
            </span>
          </div>
          
          {team.status === 'forming' && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <p className="text-yellow-800">
                Waiting for all members and mentor to accept invitations.
                {team.isReadyForRegistration && (
                  <span className="block mt-2 font-medium text-green-700">
                    ✓ All invitations accepted! Team is ready for registration.
                  </span>
                )}
              </p>
            </div>
          )}
        </motion.div>

        {/* Team Members */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl p-6 shadow-lg"
        >
          <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <UserGroupIcon className="w-6 h-6" />
            Team Members ({team.members.length})
          </h2>
          
          <div className="space-y-3">
            {team.members.map((member, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
                    <span className="text-indigo-600 font-medium">
                      {member.user.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">
                      {member.user.name}
                      {member.user._id === team.creator._id && (
                        <span className="ml-2 text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                          Creator
                        </span>
                      )}
                    </p>
                    <p className="text-sm text-gray-600">{member.user.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {getStatusIcon(member.status)}
                  <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(member.status)}`}>
                    {member.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Mentor Section */}
        {team.mentor?.user && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-2xl p-6 shadow-lg"
          >
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Mentor</h2>
            
            <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                  <span className="text-purple-600 font-medium">
                    {team.mentor.user.name.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div>
                  <p className="font-medium text-gray-800">{team.mentor.user.name}</p>
                  <p className="text-sm text-gray-600">{team.mentor.user.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {getStatusIcon(team.mentor.status)}
                <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(team.mentor.status)}`}>
                  {team.mentor.status}
                </span>
              </div>
            </div>
          </motion.div>
        )}

        {/* Event Details */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-2xl p-6 shadow-lg"
        >
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Event Information</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600">Event Name</p>
              <p className="font-medium">{team.event.title}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Event Date</p>
              <p className="font-medium">{formatDate(team.event.startDate)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Team Created</p>
              <p className="font-medium">{formatDate(team.createdAt)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Last Updated</p>
              <p className="font-medium">{formatDate(team.updatedAt)}</p>
            </div>
          </div>
        </motion.div>

        {/* Actions */}
        {(isCreator || userMember || isMentor) && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white rounded-2xl p-6 shadow-lg"
          >
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Actions</h2>
            
            <div className="flex gap-3">
              {team.status === 'ready' && isCreator && (
                <button className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors">
                  Register for Event
                </button>
              )}
              
              {team.status === 'registered' && isCreator && (
                <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2">
                  <DocumentIcon className="w-4 h-4" />
                  Submit Proofs
                </button>
              )}
              
              <button
                onClick={() => navigate('/student/teams')}
                className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
              >
                Back to Teams
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default TeamDetails;
