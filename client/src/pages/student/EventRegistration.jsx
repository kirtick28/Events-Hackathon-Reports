import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  UserGroupIcon, 
  UserIcon, 
  PlusIcon, 
  TrashIcon,
  CheckCircleIcon 
} from '@heroicons/react/24/outline';
import api from '../../utils/api';
import { useAuth } from '../../contexts/AuthContext';

const EventRegistration = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [registrationType, setRegistrationType] = useState('solo'); // 'solo' or 'team'
  const [teamName, setTeamName] = useState('');
  const [teamMembers, setTeamMembers] = useState([{ name: '', email: '', rollNumber: '' }]);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const response = await api.get(`/events/${eventId}`);
        setEvent(response.data);
        
        // Set default registration type based on team size
        const minSize = response.data.eligibility.teamSize.min;
        const maxSize = response.data.eligibility.teamSize.max;
        
        if (minSize === 1 && maxSize === 1) {
          setRegistrationType('solo');
        } else {
          setRegistrationType(minSize === 1 ? 'solo' : 'team');
        }
      } catch (err) {
        console.error('Failed to fetch event:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchEvent();
  }, [eventId]);

  const addTeamMember = () => {
    if (teamMembers.length < event.eligibility.teamSize.max) {
      setTeamMembers([...teamMembers, { name: '', email: '', rollNumber: '' }]);
    }
  };

  const removeTeamMember = (index) => {
    if (teamMembers.length > 1) {
      setTeamMembers(teamMembers.filter((_, i) => i !== index));
    }
  };

  const updateTeamMember = (index, field, value) => {
    const updated = teamMembers.map((member, i) => 
      i === index ? { ...member, [field]: value } : member
    );
    setTeamMembers(updated);
  };

  const validateForm = () => {
    const newErrors = {};

    if (registrationType === 'team') {
      if (!teamName.trim()) {
        newErrors.teamName = 'Team name is required';
      }

      teamMembers.forEach((member, index) => {
        if (!member.name.trim()) {
          newErrors[`member_${index}_name`] = 'Name is required';
        }
        if (!member.email.trim()) {
          newErrors[`member_${index}_email`] = 'Email is required';
        }
        if (!member.rollNumber.trim()) {
          newErrors[`member_${index}_rollNumber`] = 'Roll number is required';
        }
      });

      const minSize = event.eligibility.teamSize.min;
      const maxSize = event.eligibility.teamSize.max;
      
      if (teamMembers.length < minSize) {
        newErrors.teamSize = `Team must have at least ${minSize} members`;
      }
      if (teamMembers.length > maxSize) {
        newErrors.teamSize = `Team cannot have more than ${maxSize} members`;
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setSubmitting(true);
    try {
      const registrationData = {
        eventId,
        type: registrationType,
        ...(registrationType === 'team' && {
          teamName,
          members: teamMembers
        })
      };

      await api.post('/registrations', registrationData);
      
      // Show success message and redirect
      navigate(`/student/events/${eventId}`, { 
        state: { message: 'Registration successful!' } 
      });
    } catch (err) {
      console.error('Registration failed:', err);
      setErrors({ submit: 'Registration failed. Please try again.' });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading event details...</p>
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-6 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Event Not Found</h2>
          <p className="text-gray-600">The event you're trying to register for doesn't exist.</p>
        </div>
      </div>
    );
  }

  const minTeamSize = event.eligibility.teamSize.min;
  const maxTeamSize = event.eligibility.teamSize.max;
  const isSoloOnly = minTeamSize === 1 && maxTeamSize === 1;
  const canChooseType = minTeamSize === 1 && maxTeamSize > 1;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-6">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl p-6 shadow-lg"
        >
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Register for Event</h1>
          <h2 className="text-xl text-gray-600 mb-4">{event.title}</h2>
          <div className="flex items-center gap-4 text-sm text-gray-500">
            <span>Team Size: {minTeamSize === maxTeamSize ? 
              (minTeamSize === 1 ? 'Solo' : `${minTeamSize} members`) : 
              `${minTeamSize} - ${maxTeamSize} members`}
            </span>
            <span>•</span>
            <span>Registration Deadline: {new Date(event.registrationDeadline || event.startDate).toLocaleDateString()}</span>
          </div>
        </motion.div>

        {/* Registration Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl p-6 shadow-lg"
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Registration Type Selection */}
            {!isSoloOnly && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Registration Type
                </label>
                <div className="grid grid-cols-2 gap-4">
                  {canChooseType && (
                    <motion.button
                      type="button"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setRegistrationType('solo')}
                      className={`p-4 rounded-xl border-2 transition-all ${
                        registrationType === 'solo'
                          ? 'border-yellow-500 bg-yellow-50 text-yellow-700'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <UserIcon className="w-8 h-8 mx-auto mb-2" />
                      <div className="font-medium">Solo Registration</div>
                      <div className="text-sm text-gray-500">Register individually</div>
                    </motion.button>
                  )}
                  <motion.button
                    type="button"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setRegistrationType('team')}
                    className={`p-4 rounded-xl border-2 transition-all ${
                      registrationType === 'team'
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <UserGroupIcon className="w-8 h-8 mx-auto mb-2" />
                    <div className="font-medium">Team Registration</div>
                    <div className="text-sm text-gray-500">Register with team</div>
                  </motion.button>
                </div>
              </div>
            )}

            {/* Team Registration Form */}
            {registrationType === 'team' && (
              <div className="space-y-6">
                {/* Team Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Team Name *
                  </label>
                  <input
                    type="text"
                    value={teamName}
                    onChange={(e) => setTeamName(e.target.value)}
                    className={`w-full px-4 py-3 rounded-xl border ${
                      errors.teamName ? 'border-red-300' : 'border-gray-200'
                    } focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400`}
                    placeholder="Enter your team name"
                  />
                  {errors.teamName && (
                    <p className="mt-1 text-sm text-red-600">{errors.teamName}</p>
                  )}
                </div>

                {/* Team Members */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <label className="block text-sm font-medium text-gray-700">
                      Team Members *
                    </label>
                    {teamMembers.length < maxTeamSize && (
                      <motion.button
                        type="button"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={addTeamMember}
                        className="flex items-center gap-2 px-3 py-2 bg-blue-500 text-white rounded-lg text-sm hover:bg-blue-600"
                      >
                        <PlusIcon className="w-4 h-4" />
                        Add Member
                      </motion.button>
                    )}
                  </div>

                  <div className="space-y-4">
                    {teamMembers.map((member, index) => (
                      <div key={index} className="p-4 border border-gray-200 rounded-xl">
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="font-medium text-gray-700">Member {index + 1}</h4>
                          {teamMembers.length > 1 && (
                            <button
                              type="button"
                              onClick={() => removeTeamMember(index)}
                              className="text-red-500 hover:text-red-700"
                            >
                              <TrashIcon className="w-5 h-5" />
                            </button>
                          )}
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div>
                            <input
                              type="text"
                              placeholder="Full Name"
                              value={member.name}
                              onChange={(e) => updateTeamMember(index, 'name', e.target.value)}
                              className={`w-full px-3 py-2 rounded-lg border ${
                                errors[`member_${index}_name`] ? 'border-red-300' : 'border-gray-200'
                              } focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400`}
                            />
                            {errors[`member_${index}_name`] && (
                              <p className="mt-1 text-xs text-red-600">{errors[`member_${index}_name`]}</p>
                            )}
                          </div>
                          <div>
                            <input
                              type="email"
                              placeholder="Email"
                              value={member.email}
                              onChange={(e) => updateTeamMember(index, 'email', e.target.value)}
                              className={`w-full px-3 py-2 rounded-lg border ${
                                errors[`member_${index}_email`] ? 'border-red-300' : 'border-gray-200'
                              } focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400`}
                            />
                            {errors[`member_${index}_email`] && (
                              <p className="mt-1 text-xs text-red-600">{errors[`member_${index}_email`]}</p>
                            )}
                          </div>
                          <div>
                            <input
                              type="text"
                              placeholder="Roll Number"
                              value={member.rollNumber}
                              onChange={(e) => updateTeamMember(index, 'rollNumber', e.target.value)}
                              className={`w-full px-3 py-2 rounded-lg border ${
                                errors[`member_${index}_rollNumber`] ? 'border-red-300' : 'border-gray-200'
                              } focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400`}
                            />
                            {errors[`member_${index}_rollNumber`] && (
                              <p className="mt-1 text-xs text-red-600">{errors[`member_${index}_rollNumber`]}</p>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {errors.teamSize && (
                    <p className="mt-2 text-sm text-red-600">{errors.teamSize}</p>
                  )}
                </div>
              </div>
            )}

            {/* Solo Registration Info */}
            {registrationType === 'solo' && (
              <div className="bg-blue-50 p-4 rounded-xl">
                <div className="flex items-center gap-3">
                  <CheckCircleIcon className="w-6 h-6 text-blue-600" />
                  <div>
                    <h4 className="font-medium text-blue-800">Solo Registration</h4>
                    <p className="text-sm text-blue-600">
                      You will be registered individually using your account details: {user.name} ({user.email})
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Error Message */}
            {errors.submit && (
              <div className="bg-red-50 p-4 rounded-xl">
                <p className="text-red-600">{errors.submit}</p>
              </div>
            )}

            {/* Submit Button */}
            <div className="flex items-center justify-between pt-6">
              <button
                type="button"
                onClick={() => navigate(`/student/events/${eventId}`)}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50"
              >
                Cancel
              </button>
              <motion.button
                type="submit"
                disabled={submitting}
                whileHover={{ scale: submitting ? 1 : 1.02 }}
                whileTap={{ scale: submitting ? 1 : 0.98 }}
                className={`px-8 py-3 rounded-xl font-medium shadow-md transition-all ${
                  submitting
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-gradient-to-r from-yellow-500 to-blue-500 hover:shadow-lg'
                } text-white`}
              >
                {submitting ? 'Registering...' : 'Register for Event'}
              </motion.button>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default EventRegistration;
