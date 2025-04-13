import React, { useState, useEffect } from 'react';
import {
  UserIcon,
  LockClosedIcon,
  EyeIcon,
  EyeSlashIcon,
  ArrowLeftIcon
} from '@heroicons/react/24/outline';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../../utils/api';
import { toast } from 'react-toastify';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const navigate = useNavigate();
  const { refreshUser } = useAuth();
  const [user, setUser] = useState({ _id: '', name: '', email: '' });
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [passwordVisibility, setPasswordVisibility] = useState({
    current: false,
    new: false,
    confirm: false
  });
  const [activeTab, setActiveTab] = useState('profile');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await api.get('/auth/profile');
        setUser(response.data);
      } catch (error) {
        toast.error('Failed to load profile data');
      }
    };
    fetchProfile();
  }, []);

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.put('/auth/update-profile', {
        name: user.name,
        email: user.email
      });
      await refreshUser();
      toast.success('Profile updated successfully!');
    } catch (error) {
      toast.error('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    setLoading(true);
    try {
      await api.put('/auth/update-profile', {
        id: user._id,
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword,
        confirmPassword: passwordForm.confirmPassword
      });
      toast.success('Password updated successfully!');
      setPasswordForm({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    } catch (error) {
      toast.error(error.response?.data?.error || 'Password update failed');
    } finally {
      setLoading(false);
    }
  };

  const toggleVisibility = (field) => {
    setPasswordVisibility((prev) => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-center bg-white rounded-2xl p-6 shadow-lg"
        >
          <h1 className="text-2xl font-bold bg-gradient-to-r from-yellow-500 to-blue-500 bg-clip-text text-transparent">
            Profile Settings
          </h1>
        </motion.div>

        <div className="flex flex-col md:flex-row gap-6">
          {/* Sidebar Tabs */}
          <div className="flex md:flex-col gap-4 w-full md:w-1/4">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setActiveTab('profile')}
              className={`flex items-center gap-3 px-6 py-4 rounded-xl transition-all w-full ${
                activeTab === 'profile'
                  ? 'bg-gradient-to-r from-yellow-500 to-blue-500 text-white shadow-lg'
                  : 'bg-white border hover:bg-gray-50 shadow-sm'
              }`}
            >
              <UserIcon className="w-5 h-5" />
              Profile Settings
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setActiveTab('security')}
              className={`flex items-center gap-3 px-6 py-4 rounded-xl transition-all w-full ${
                activeTab === 'security'
                  ? 'bg-gradient-to-r from-yellow-500 to-blue-500 text-white shadow-lg'
                  : 'bg-white border hover:bg-gray-50 shadow-sm'
              }`}
            >
              <LockClosedIcon className="w-5 h-5" />
              Security Settings
            </motion.button>
          </div>

          {/* Content */}
          <div className="w-full md:w-3/4">
            <AnimatePresence mode="wait">
              {activeTab === 'profile' && (
                <motion.div
                  key="profile"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="bg-white p-8 rounded-2xl shadow-lg space-y-6"
                >
                  <h2 className="text-xl font-semibold text-gray-800">Profile Information</h2>
                  <form onSubmit={handleProfileUpdate} className="space-y-6">
                    <div className="space-y-4">
                      <div>
                        <label className="block mb-2 text-sm font-medium text-gray-700">
                          Full Name
                        </label>
                        <input
                          type="text"
                          value={user.name}
                          onChange={(e) => setUser({ ...user, name: e.target.value })}
                          className="w-full px-4 py-3.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 bg-gray-50 text-base"
                        />
                      </div>
                      <div>
                        <label className="block mb-2 text-sm font-medium text-gray-700">
                          Email Address
                        </label>
                        <input
                          type="email"
                          value={user.email}
                          onChange={(e) => setUser({ ...user, email: e.target.value })}
                          className="w-full px-4 py-3.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 bg-gray-50 text-base"
                        />
                      </div>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      type="submit"
                      disabled={loading}
                      className="w-full py-3.5 bg-gradient-to-r from-yellow-500 to-blue-500 text-white rounded-xl font-medium shadow-md hover:shadow-lg transition-all"
                    >
                      {loading ? 'Updating...' : 'Update Profile'}
                    </motion.button>
                  </form>
                </motion.div>
              )}

              {activeTab === 'security' && (
                <motion.div
                  key="security"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="bg-white p-8 rounded-2xl shadow-lg space-y-6"
                >
                  <h2 className="text-xl font-semibold text-gray-800">Password Settings</h2>
                  <form onSubmit={handlePasswordChange} className="space-y-6">
                    <div className="space-y-4">
                      {['currentPassword', 'newPassword', 'confirmPassword'].map((field) => (
                        <div key={field}>
                          <label className="block mb-2 text-sm font-medium text-gray-700">
                            {field === 'currentPassword'
                              ? 'Current Password'
                              : field === 'newPassword'
                              ? 'New Password'
                              : 'Confirm New Password'}
                          </label>
                          <div className="relative">
                            <input
                              type={
                                passwordVisibility[
                                  field === 'currentPassword'
                                    ? 'current'
                                    : field === 'newPassword'
                                    ? 'new'
                                    : 'confirm'
                                ]
                                  ? 'text'
                                  : 'password'
                              }
                              value={passwordForm[field]}
                              onChange={(e) =>
                                setPasswordForm({
                                  ...passwordForm,
                                  [field]: e.target.value
                                })
                              }
                              className="w-full px-4 py-3.5 pr-12 rounded-xl border border-gray-200 focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 bg-gray-50 text-base"
                            />
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              type="button"
                              onClick={() =>
                                toggleVisibility(
                                  field === 'currentPassword'
                                    ? 'current'
                                    : field === 'newPassword'
                                    ? 'new'
                                    : 'confirm'
                                )
                              }
                              className="absolute top-3.5 right-4 text-gray-400 hover:text-gray-600"
                            >
                              {passwordVisibility[
                                field === 'currentPassword'
                                  ? 'current'
                                  : field === 'newPassword'
                                  ? 'new'
                                  : 'confirm'
                              ] ? (
                                <EyeSlashIcon className="w-5 h-5" />
                              ) : (
                                <EyeIcon className="w-5 h-5" />
                              )}
                            </motion.button>
                          </div>
                        </div>
                      ))}
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      type="submit"
                      disabled={loading}
                      className="w-full py-3.5 bg-gradient-to-r from-yellow-500 to-blue-500 text-white rounded-xl font-medium shadow-md hover:shadow-lg transition-all"
                    >
                      {loading ? 'Updating...' : 'Change Password'}
                    </motion.button>
                  </form>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
