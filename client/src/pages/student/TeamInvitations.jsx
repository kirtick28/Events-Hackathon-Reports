import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { format, parseISO } from 'date-fns';
import api from '../../utils/api';

const TeamInvitations = () => {
  const [invitations, setInvitations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [responding, setResponding] = useState({});

  useEffect(() => {
    fetchInvitations();
  }, []);

  const fetchInvitations = async () => {
    try {
      const response = await api.get('/teams/invitations');
      setInvitations(response.data || []);
    } catch (err) {
      console.error('Failed to fetch invitations:', err);
      setInvitations([]); // Set empty array on error
    } finally {
      setLoading(false);
    }
  };

  const handleResponse = async (teamId, response) => {
    setResponding({ ...responding, [teamId]: true });
    try {
      await api.post(`/teams/${teamId}/respond`, { response });
      // Remove the invitation from the list after responding
      setInvitations(invitations.filter((inv) => inv._id !== teamId));
    } catch (err) {
      console.error('Failed to respond to invitation:', err);
    } finally {
      setResponding({ ...responding, [teamId]: false });
    }
  };

  const formatDate = (date) => format(parseISO(date), 'dd MMM yyyy, h:mm a');

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading invitations...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-6">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Team Invitations
          </h1>
          <p className="text-gray-600">
            Respond to team invitations from other students
          </p>
        </motion.div>

        {invitations.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white rounded-2xl p-8 shadow-lg text-center"
          >
            <div className="text-gray-400 mb-4">
              <svg
                className="w-16 h-16 mx-auto"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              No Pending Invitations
            </h3>
            <p className="text-gray-500">
              You don't have any team invitations at the moment.
            </p>
          </motion.div>
        ) : (
          <div className="space-y-6">
            {invitations.map((team, index) => (
              <motion.div
                key={team._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-2xl p-6 shadow-lg"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-1">
                      {team.name}
                    </h3>
                    <p className="text-gray-600">
                      Event:{' '}
                      <span className="font-medium">{team.event.title}</span>
                    </p>
                    <p className="text-sm text-gray-500">
                      Created by: {team.creator.name} ({team.creator.email})
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-500">Event Date</p>
                    <p className="font-medium">
                      {formatDate(team.event.startDate)}
                    </p>
                  </div>
                </div>

                <div className="mb-4">
                  <h4 className="font-medium text-gray-700 mb-2">
                    Team Members:
                  </h4>
                  <div className="space-y-1">
                    {team.members.map((member) => (
                      <div
                        key={member.user._id}
                        className="flex items-center justify-between text-sm"
                      >
                        <span>
                          {member.user.name} ({member.user.email})
                        </span>
                        <span
                          className={`px-2 py-1 rounded text-xs ${
                            member.status === 'accepted'
                              ? 'bg-green-100 text-green-800'
                              : member.status === 'rejected'
                              ? 'bg-red-100 text-red-800'
                              : 'bg-yellow-100 text-yellow-800'
                          }`}
                        >
                          {member.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {team.mentor?.user && (
                  <div className="mb-4">
                    <h4 className="font-medium text-gray-700 mb-2">Mentor:</h4>
                    <div className="flex items-center justify-between text-sm">
                      <span>
                        {team.mentor.user.name} ({team.mentor.user.email})
                      </span>
                      <span
                        className={`px-2 py-1 rounded text-xs ${
                          team.mentor.status === 'accepted'
                            ? 'bg-green-100 text-green-800'
                            : team.mentor.status === 'rejected'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}
                      >
                        {team.mentor.status}
                      </span>
                    </div>
                  </div>
                )}

                <div className="flex gap-3 pt-4 border-t">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleResponse(team._id, 'accepted')}
                    disabled={responding[team._id]}
                    className="flex-1 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {responding[team._id] ? 'Responding...' : 'Accept'}
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleResponse(team._id, 'rejected')}
                    disabled={responding[team._id]}
                    className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {responding[team._id] ? 'Responding...' : 'Reject'}
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TeamInvitations;
