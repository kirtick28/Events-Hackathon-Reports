import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { motion } from 'framer-motion';
import {
  CalendarIcon,
  TrophyIcon,
  UserGroupIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  EyeIcon,
  MagnifyingGlassIcon,
  FunnelIcon
} from '@heroicons/react/24/outline';
import api from '../../utils/api';

const PastParticipation = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');

  const [pastParticipations, setPastParticipations] = useState([]);

  useEffect(() => {
    fetchPastParticipations();
  }, []);

  const fetchPastParticipations = async () => {
    try {
      setLoading(true);
      const response = await api.get('/dashboard/past-participations');
      setPastParticipations(response.data || []);
    } catch (error) {
      console.error('Failed to fetch past participations:', error);
      // Fallback to empty array
      setPastParticipations([]);
    } finally {
      setLoading(false);
    }
  };

  const getFilteredParticipations = () => {
    return pastParticipations.filter((participation) => {
      const matchesSearch =
        participation.eventTitle
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        participation.teamName
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        participation.description
          .toLowerCase()
          .includes(searchTerm.toLowerCase());

      const matchesType =
        filterType === 'all' || participation.eventType === filterType;
      const matchesStatus =
        filterStatus === 'all' || participation.result === filterStatus;

      return matchesSearch && matchesType && matchesStatus;
    });
  };

  const getResultBadge = (result, position) => {
    switch (result) {
      case 'winner':
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">
            <TrophyIcon className="w-4 h-4 mr-1" />
            Winner (1st)
          </span>
        );
      case 'runner-up':
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800">
            <TrophyIcon className="w-4 h-4 mr-1" />
            Runner-up ({position}nd)
          </span>
        );
      case 'participated':
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
            <CheckCircleIcon className="w-4 h-4 mr-1" />
            Participated
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800">
            <XCircleIcon className="w-4 h-4 mr-1" />
            {result}
          </span>
        );
    }
  };

  const getEventTypeColor = (type) => {
    switch (type) {
      case 'hackathon':
        return 'bg-purple-100 text-purple-800';
      case 'workshop':
        return 'bg-orange-100 text-orange-800';
      case 'competition':
        return 'bg-green-100 text-green-800';
      case 'seminar':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6"
        >
          <div>
            <h1 className="text-3xl font-bold text-gray-800">
              Past Participations
            </h1>
            <p className="text-gray-600">
              Track your journey and achievements in college events
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="bg-white rounded-lg px-4 py-2 shadow-sm">
              <span className="text-sm text-gray-500">Total Events:</span>
              <span className="ml-2 font-bold text-gray-900">
                {pastParticipations.length}
              </span>
            </div>
            <div className="bg-white rounded-lg px-4 py-2 shadow-sm">
              <span className="text-sm text-gray-500">Certificates:</span>
              <span className="ml-2 font-bold text-green-600">
                {pastParticipations.filter((p) => p.certificate).length}
              </span>
            </div>
          </div>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl p-6 shadow-lg space-y-4"
        >
          <div className="relative">
            <MagnifyingGlassIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search events, teams, or descriptions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
            />
          </div>

          <div className="flex flex-wrap gap-4">
            <div className="flex items-center gap-2">
              <FunnelIcon className="w-5 h-5 text-gray-500" />
              <span className="text-sm font-medium text-gray-700">
                Filters:
              </span>
            </div>

            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
            >
              <option value="all">All Types</option>
              <option value="hackathon">Hackathons</option>
              <option value="workshop">Workshops</option>
              <option value="competition">Competitions</option>
              <option value="seminar">Seminars</option>
            </select>

            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
            >
              <option value="all">All Results</option>
              <option value="winner">Winners</option>
              <option value="runner-up">Runner-ups</option>
              <option value="participated">Participated</option>
            </select>
          </div>
        </motion.div>

        {/* Participations List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-6"
        >
          {getFilteredParticipations().map((participation, index) => (
            <motion.div
              key={participation.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
            >
              <div className="p-6">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-bold text-gray-900">
                        {participation.eventTitle}
                      </h3>
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium ${getEventTypeColor(
                          participation.eventType
                        )}`}
                      >
                        {participation.eventType.charAt(0).toUpperCase() +
                          participation.eventType.slice(1)}
                      </span>
                    </div>

                    <p className="text-gray-600 mb-3">
                      {participation.description}
                    </p>

                    <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <CalendarIcon className="w-4 h-4" />
                        <span>
                          {new Date(
                            participation.participationDate
                          ).toLocaleDateString()}
                        </span>
                      </div>

                      {participation.teamName && (
                        <div className="flex items-center gap-1">
                          <UserGroupIcon className="w-4 h-4" />
                          <span>{participation.teamName}</span>
                        </div>
                      )}

                      {participation.certificate && (
                        <div className="flex items-center gap-1 text-green-600">
                          <CheckCircleIcon className="w-4 h-4" />
                          <span>Certificate Earned</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-3">
                    {getResultBadge(
                      participation.result,
                      participation.position
                    )}

                    {participation.teamMembers && (
                      <div className="text-right">
                        <p className="text-sm text-gray-500 mb-1">
                          Team Members:
                        </p>
                        <div className="text-sm text-gray-700">
                          {participation.teamMembers
                            .slice(0, 2)
                            .map((member, idx) => (
                              <div key={idx}>{member}</div>
                            ))}
                          {participation.teamMembers.length > 2 && (
                            <div className="text-gray-500">
                              +{participation.teamMembers.length - 2} more
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Empty State */}
        {getFilteredParticipations().length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16 bg-white rounded-2xl shadow-lg"
          >
            <TrophyIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              No Participations Found
            </h3>
            <p className="text-gray-600">
              {searchTerm || filterType !== 'all' || filterStatus !== 'all'
                ? 'Try adjusting your search or filters to find participations.'
                : "You haven't participated in any events yet. Start exploring events to build your portfolio!"}
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default PastParticipation;
