import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import api from '../../utils/api';

const TeamCreation = () => {
  const navigate = useNavigate();
  const { eventId } = useParams();
  const [event, setEvent] = useState(null);
  const [availableUsers, setAvailableUsers] = useState({
    students: [],
    staff: []
  });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [teamData, setTeamData] = useState({
    name: '',
    memberEmails: [],
    mentorEmail: ''
  });
  const [errors, setErrors] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const [mentorSearchTerm, setMentorSearchTerm] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch event details
        const eventResponse = await api.get(`/events/${eventId}`);
        setEvent(eventResponse.data);

        // Fetch available users
        const usersResponse = await api.get(
          `/teams/available-users/${eventId}`
        );
        setAvailableUsers(usersResponse.data || { students: [], staff: [] });
      } catch (err) {
        console.error('Failed to fetch data:', err);
        setErrors({ general: 'Failed to load team creation data' });
        setAvailableUsers({ students: [], staff: [] }); // Set empty arrays on error
      } finally {
        setLoading(false);
      }
    };

    if (eventId) {
      fetchData();
    }
  }, [eventId]);

  const handleAddMember = (studentEmail) => {
    if (!teamData.memberEmails.includes(studentEmail)) {
      const maxMembers = event?.eligibility?.teamSize?.max || 4;
      const currentTotal = teamData.memberEmails.length + 1; // +1 for creator

      if (currentTotal < maxMembers) {
        setTeamData({
          ...teamData,
          memberEmails: [...teamData.memberEmails, studentEmail]
        });
        setSearchTerm('');
      } else {
        setErrors({ members: `Maximum team size is ${maxMembers} members` });
      }
    }
  };

  const handleRemoveMember = (emailToRemove) => {
    setTeamData({
      ...teamData,
      memberEmails: teamData.memberEmails.filter(
        (email) => email !== emailToRemove
      )
    });
    setErrors({ ...errors, members: '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setErrors({});

    try {
      // Validate team size
      const totalMembers = teamData.memberEmails.length + 1; // +1 for creator
      const minSize = event?.eligibility?.teamSize?.min || 1;
      const maxSize = event?.eligibility?.teamSize?.max || 4;

      if (totalMembers < minSize || totalMembers > maxSize) {
        setErrors({
          members: `Team size must be between ${minSize} and ${maxSize} members`
        });
        return;
      }

      // Validate mentor requirement
      if (event?.requiresMentor && !teamData.mentorEmail) {
        setErrors({ mentor: 'Mentor is required for this event' });
        return;
      }

      const response = await api.post('/teams/create', {
        name: teamData.name,
        eventId,
        memberEmails: teamData.memberEmails,
        mentorEmail: teamData.mentorEmail || undefined
      });

      // Navigate to team management page
      navigate(`/student/teams/${response.data._id}`);
    } catch (error) {
      console.error('Error creating team:', error);
      setErrors({
        general: error.response?.data?.error || 'Failed to create team'
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading team creation form...</p>
        </div>
      </div>
    );
  }

  const filteredStudents = (availableUsers.students || []).filter((student) => {
    // Filter out current user (team creator)
    if (student.email === user?.email) return false;

    // Filter out already registered students for this event
    // This would need to be implemented based on your registration logic
    // For now, we'll just filter out already added team members
    if (teamData.memberEmails.includes(student.email)) return false;

    // Apply search filter
    if (searchTerm) {
      return (
        student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Show all students if no search term
    return true;
  });

  const filteredStaff = (availableUsers.staff || []).filter(
    (staff) =>
      staff.name.toLowerCase().includes(mentorSearchTerm.toLowerCase()) ||
      staff.email.toLowerCase().includes(mentorSearchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-6">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Create Team</h1>
          {event && (
            <p className="text-gray-600">
              Creating team for:{' '}
              <span className="font-semibold">{event.title}</span>
            </p>
          )}
        </motion.div>

        {errors.general && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg"
          >
            {errors.general}
          </motion.div>
        )}

        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          onSubmit={handleSubmit}
          className="bg-white rounded-2xl p-6 shadow-lg space-y-6"
        >
          {/* Team Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Team Name
            </label>
            <input
              type="text"
              value={teamData.name}
              onChange={(e) =>
                setTeamData({ ...teamData, name: e.target.value })
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Enter a unique team name"
              required
            />
          </div>

          {/* Event Info */}
          {event && (
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-medium text-gray-800 mb-2">Event Details</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">Team Size:</span>
                  <span className="ml-2 font-medium">
                    {event.eligibility.teamSize.min ===
                    event.eligibility.teamSize.max
                      ? `${event.eligibility.teamSize.min} members`
                      : `${event.eligibility.teamSize.min}-${event.eligibility.teamSize.max} members`}
                  </span>
                </div>
                <div>
                  <span className="text-gray-600">Mentor Required:</span>
                  <span className="ml-2 font-medium">
                    {event.requiresMentor ? 'Yes' : 'No'}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Team Members */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium text-gray-700">
                Team Members
              </h3>
              <span className="text-sm text-gray-500">
                {teamData.memberEmails.length + 1} /{' '}
                {event?.eligibility?.teamSize?.max || 4} members
              </span>
            </div>

            {/* Current team creator */}
            <div className="bg-blue-50 p-3 rounded-lg">
              <div className="flex items-center justify-between">
                <span className="font-medium text-blue-800">
                  You (Team Creator)
                </span>
                <span className="text-xs bg-blue-200 text-blue-800 px-2 py-1 rounded">
                  Creator
                </span>
              </div>
            </div>

            {/* Selected members */}
            {teamData.memberEmails.map((email, index) => {
              const student = availableUsers.students.find(
                (s) => s.email === email
              );
              return (
                <motion.div
                  key={email}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="bg-green-50 p-3 rounded-lg"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-medium text-green-800">
                        {student?.name || email}
                      </span>
                      <p className="text-sm text-green-600">{email}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveMember(email)}
                      className="text-red-500 hover:text-red-700 text-sm"
                    >
                      Remove
                    </button>
                  </div>
                </motion.div>
              );
            })}

            {/* Add member search */}
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Search and Add Students
              </label>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by name or email..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />

              <div className="mt-3 max-h-40 overflow-y-auto space-y-2">
                {filteredStudents.length > 0 ? (
                  filteredStudents.slice(0, 10).map((student) => (
                    <motion.div
                      key={student._id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex items-center justify-between p-2 bg-gray-50 rounded"
                    >
                      <div>
                        <span className="font-medium">{student.name}</span>
                        <p className="text-sm text-gray-600">{student.email}</p>
                        <p className="text-xs text-gray-500">
                          {student.department?.name} •{' '}
                          {student.year
                            ? `${student.year}${
                                student.year === 1
                                  ? 'st'
                                  : student.year === 2
                                  ? 'nd'
                                  : student.year === 3
                                  ? 'rd'
                                  : 'th'
                              } Year`
                            : ''}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleAddMember(student.email)}
                        disabled={teamData.memberEmails.includes(student.email)}
                        className="px-3 py-1 bg-indigo-500 text-white rounded text-sm hover:bg-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {teamData.memberEmails.includes(student.email)
                          ? 'Added'
                          : 'Add'}
                      </button>
                    </motion.div>
                  ))
                ) : (
                  <p className="text-gray-500 text-sm">
                    {searchTerm
                      ? 'No students found matching your search'
                      : 'No available students'}
                  </p>
                )}
                {filteredStudents.length > 10 && (
                  <p className="text-xs text-gray-500 text-center">
                    Showing first 10 results. Use search to find specific
                    students.
                  </p>
                )}
              </div>
            </div>

            {errors.members && (
              <p className="text-red-600 text-sm">{errors.members}</p>
            )}
          </div>

          {/* Mentor Selection */}
          {event?.requiresMentor && (
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-700">
                Select Mentor <span className="text-red-500">*</span>
              </h3>

              {teamData.mentorEmail ? (
                <div className="bg-purple-50 p-3 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-medium text-purple-800">
                        {availableUsers.staff.find(
                          (s) => s.email === teamData.mentorEmail
                        )?.name || teamData.mentorEmail}
                      </span>
                      <p className="text-sm text-purple-600">
                        {teamData.mentorEmail}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() =>
                        setTeamData({ ...teamData, mentorEmail: '' })
                      }
                      className="text-red-500 hover:text-red-700 text-sm"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ) : (
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Search and Select Mentor
                  </label>
                  <input
                    type="text"
                    value={mentorSearchTerm}
                    onChange={(e) => setMentorSearchTerm(e.target.value)}
                    placeholder="Search by name or email..."
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />

                  {mentorSearchTerm && (
                    <div className="mt-3 max-h-40 overflow-y-auto space-y-2">
                      {filteredStaff.length > 0 ? (
                        filteredStaff.map((staff) => (
                          <motion.div
                            key={staff._id}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="flex items-center justify-between p-2 bg-gray-50 rounded"
                          >
                            <div>
                              <span className="font-medium">{staff.name}</span>
                              <p className="text-sm text-gray-600">
                                {staff.email}
                              </p>
                            </div>
                            <button
                              type="button"
                              onClick={() => {
                                setTeamData({
                                  ...teamData,
                                  mentorEmail: staff.email
                                });
                                setMentorSearchTerm('');
                              }}
                              className="px-3 py-1 bg-purple-500 text-white rounded text-sm hover:bg-purple-600"
                            >
                              Select
                            </button>
                          </motion.div>
                        ))
                      ) : (
                        <p className="text-gray-500 text-sm">No staff found</p>
                      )}
                    </div>
                  )}
                </div>
              )}

              {errors.mentor && (
                <p className="text-red-600 text-sm">{errors.mentor}</p>
              )}
            </div>
          )}

          {/* Submit Button */}
          <div className="pt-6">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={submitting}
              className="w-full px-6 py-3 bg-indigo-500 text-white font-medium rounded-lg hover:bg-indigo-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? 'Creating Team...' : 'Create Team'}
            </motion.button>
          </div>
        </motion.form>
      </div>
    </div>
  );
};

export default TeamCreation;
