import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { motion } from 'framer-motion';
import {
  UserIcon,
  EnvelopeIcon,
  PhoneIcon,
  AcademicCapIcon,
  CalendarIcon,
  PencilIcon,
  CheckIcon,
  XMarkIcon,
  CameraIcon,
  TrophyIcon,
  StarIcon
} from '@heroicons/react/24/outline';

const Profile = () => {
  const { user, updateUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    rollNumber: '',
    year: '',
    department: '',
    class: '',
    bio: '',
    skills: '',
    interests: '',
    achievements: ''
  });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        rollNumber: user.rollNumber || '',
        year: user.year || '',
        department: user.department?.name || '',
        class: user.class || '',
        bio: user.bio || '',
        skills: user.skills || '',
        interests: user.interests || '',
        achievements: user.achievements || ''
      });
    }
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      // Mock API call - replace with actual API
      // const response = await api.put('/auth/profile', formData);
      // updateUser(response.data);

      // For now, just simulate success
      setTimeout(() => {
        setEditing(false);
        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Failed to update profile:', error);
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      name: user.name || '',
      email: user.email || '',
      phone: user.phone || '',
      rollNumber: user.rollNumber || '',
      year: user.year || '',
      department: user.department?.name || '',
      class: user.class || '',
      bio: user.bio || '',
      skills: user.skills || '',
      interests: user.interests || '',
      achievements: user.achievements || ''
    });
    setEditing(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-6">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-between items-center"
        >
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
            <p className="text-gray-500">
              Manage your personal information and preferences
            </p>
          </div>
          <div className="flex gap-3">
            {editing ? (
              <>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleSave}
                  disabled={loading}
                  className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50 flex items-center gap-2"
                >
                  <CheckIcon className="h-4 w-4" />
                  {loading ? 'Saving...' : 'Save'}
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleCancel}
                  className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 flex items-center gap-2"
                >
                  <XMarkIcon className="h-4 w-4" />
                  Cancel
                </motion.button>
              </>
            ) : (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setEditing(true)}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 flex items-center gap-2"
              >
                <PencilIcon className="h-4 w-4" />
                Edit Profile
              </motion.button>
            )}
          </div>
        </motion.div>

        {/* Profile Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-lg overflow-hidden"
        >
          {/* Header Section */}
          <div className="bg-gradient-to-r from-blue-500 to-indigo-600 px-8 py-12 text-white">
            <div className="flex items-center space-x-6">
              <div className="relative">
                <div className="h-24 w-24 bg-white/20 rounded-full flex items-center justify-center">
                  <UserIcon className="h-12 w-12" />
                </div>
                {editing && (
                  <button className="absolute bottom-0 right-0 bg-blue-600 rounded-full p-2 hover:bg-blue-700">
                    <CameraIcon className="h-4 w-4" />
                  </button>
                )}
              </div>
              <div>
                <h2 className="text-3xl font-bold">
                  {user?.name || 'Student'}
                </h2>
                <p className="text-blue-100 text-lg">
                  {formData.rollNumber || 'Roll Number'}
                </p>
                <p className="text-blue-200">
                  {user?.department?.name || 'Department'} •{' '}
                  {user?.class?.name || 'Class'} •{' '}
                  {formData.year
                    ? `${formData.year}${
                        formData.year === 1
                          ? 'st'
                          : formData.year === 2
                          ? 'nd'
                          : formData.year === 3
                          ? 'rd'
                          : 'th'
                      } Year`
                    : 'Year'}
                </p>
              </div>
            </div>
          </div>

          {/* Content Section */}
          <div className="p-8 space-y-8">
            {/* Basic Information */}
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-6">
                Basic Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name
                  </label>
                  {editing ? (
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  ) : (
                    <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                      <UserIcon className="h-5 w-5 text-gray-400" />
                      <span className="text-gray-900">
                        {user?.name || 'Not provided'}
                      </span>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  {editing ? (
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  ) : (
                    <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                      <EnvelopeIcon className="h-5 w-5 text-gray-400" />
                      <span className="text-gray-900">
                        {user?.email || 'Not provided'}
                      </span>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number
                  </label>
                  {editing ? (
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  ) : (
                    <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                      <PhoneIcon className="h-5 w-5 text-gray-400" />
                      <span className="text-gray-900">
                        {formData.phone || 'Not provided'}
                      </span>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Roll Number
                  </label>
                  {editing ? (
                    <input
                      type="text"
                      name="rollNumber"
                      value={formData.rollNumber}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  ) : (
                    <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                      <AcademicCapIcon className="h-5 w-5 text-gray-400" />
                      <span className="text-gray-900">
                        {formData.rollNumber || 'Not provided'}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Academic Information */}
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-6">
                Academic Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Department
                  </label>
                  <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                    <AcademicCapIcon className="h-5 w-5 text-gray-400" />
                    <span className="text-gray-900">
                      {user?.department?.name || 'Not provided'}
                    </span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Year
                  </label>
                  <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                    <CalendarIcon className="h-5 w-5 text-gray-400" />
                    <span className="text-gray-900">
                      {formData.year
                        ? `${formData.year}${
                            formData.year === 1
                              ? 'st'
                              : formData.year === 2
                              ? 'nd'
                              : formData.year === 3
                              ? 'rd'
                              : 'th'
                          } Year`
                        : 'Not provided'}
                    </span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Class
                  </label>
                  <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                    <UserIcon className="h-5 w-5 text-gray-400" />
                    <span className="text-gray-900">
                      {user?.class?.name || 'Not provided'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Personal Information */}
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-6">
                Personal Information
              </h3>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Bio
                  </label>
                  {editing ? (
                    <textarea
                      name="bio"
                      value={formData.bio}
                      onChange={handleInputChange}
                      rows={3}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Tell us about yourself..."
                    />
                  ) : (
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <p className="text-gray-900">
                        {formData.bio ||
                          'No bio provided. Click edit to add your personal information.'}
                      </p>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Skills
                  </label>
                  {editing ? (
                    <textarea
                      name="skills"
                      value={formData.skills}
                      onChange={handleInputChange}
                      rows={2}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="List your technical skills..."
                    />
                  ) : (
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <p className="text-gray-900">
                        {formData.skills ||
                          'No skills listed. Add your technical expertise.'}
                      </p>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Interests
                  </label>
                  {editing ? (
                    <textarea
                      name="interests"
                      value={formData.interests}
                      onChange={handleInputChange}
                      rows={2}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="What are you passionate about?"
                    />
                  ) : (
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <p className="text-gray-900">
                        {formData.interests ||
                          "No interests listed. Share what you're passionate about."}
                      </p>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Achievements
                  </label>
                  {editing ? (
                    <textarea
                      name="achievements"
                      value={formData.achievements}
                      onChange={handleInputChange}
                      rows={3}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="List your notable achievements..."
                    />
                  ) : (
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <p className="text-gray-900">
                        {formData.achievements ||
                          'No achievements listed. Add your accomplishments and awards.'}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Profile;
