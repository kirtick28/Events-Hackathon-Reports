import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  MagnifyingGlassIcon,
  FunnelIcon,
  UserIcon,
  AcademicCapIcon,
  BriefcaseIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  EyeIcon
} from '@heroicons/react/24/outline';
import api from '../../utils/api';

const Reports = ({ basePath = '' }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [pagination, setPagination] = useState({});
  const [filters, setFilters] = useState({
    search: '',
    role: 'all',
    department: 'all',
    page: 1
  });

  // Check if this is Innovation Cell context
  const isInnovationCell = basePath.includes('/innovation-cell');

  useEffect(() => {
    fetchDepartments();
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [filters]);

  const fetchDepartments = async () => {
    try {
      console.log('Fetching departments...');
      const response = await api.get('/reports/departments');
      console.log('Departments response:', response.data);
      setDepartments(response.data || []);
    } catch (error) {
      console.error('Failed to fetch departments:', error);
      console.error('Error details:', error.response?.data || error.message);
    }
  };

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value && value !== 'all') {
          params.append(key, value);
        }
      });

      console.log('Fetching users with params:', params.toString());
      const response = await api.get(`/reports/users?${params.toString()}`);
      console.log('Users response:', response.data);
      setUsers(response.data.users || []);
      setPagination(response.data.pagination || {});
    } catch (error) {
      console.error('Failed to fetch users:', error);
      console.error('Error details:', error.response?.data || error.message);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
      page: 1 // Reset to first page when filters change
    }));
  };

  const handlePageChange = (newPage) => {
    setFilters((prev) => ({
      ...prev,
      page: newPage
    }));
  };

  const handleViewDetails = (userId) => {
    navigate(`${basePath}/reports/user/${userId}`);
  };

  const getRoleIcon = (role) => {
    switch (role) {
      case 'student':
        return <AcademicCapIcon className="h-5 w-5 text-blue-500" />;
      case 'staff':
        return <BriefcaseIcon className="h-5 w-5 text-green-500" />;
      default:
        return <UserIcon className="h-5 w-5 text-gray-500" />;
    }
  };

  const getRoleBadge = (role) => {
    const colors = {
      student: 'bg-blue-100 text-blue-800',
      staff: 'bg-green-100 text-green-800',
      innovation: 'bg-purple-100 text-purple-800',
      hod: 'bg-orange-100 text-orange-800',
      principal: 'bg-red-100 text-red-800',
      superadmin: 'bg-gray-100 text-gray-800'
    };

    return (
      <span
        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
          colors[role] || 'bg-gray-100 text-gray-800'
        }`}
      >
        {role?.charAt(0).toUpperCase() + role?.slice(1).replace('-', ' ') ||
          'Unknown'}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-white rounded-2xl p-6 shadow-lg"
        >
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              User Reports & Analytics
            </h1>
            <p className="text-gray-600 text-lg mt-2">
              {isInnovationCell
                ? 'Comprehensive insights for students, staff, and HODs'
                : 'Comprehensive insights and detailed analytics for all users'}
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="bg-gradient-to-r from-yellow-500 to-blue-500 text-white rounded-xl px-6 py-3 shadow-lg">
              <span className="text-sm font-medium">Total Users:</span>
              <span className="ml-2 text-xl font-bold">
                {pagination.total || 0}
              </span>
            </div>
          </div>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl p-6 shadow-lg space-y-6"
        >
          <div className="relative">
            <MagnifyingGlassIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name, email, or roll number..."
              value={filters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 bg-gray-50"
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
              value={filters.role}
              onChange={(e) => handleFilterChange('role', e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400"
            >
              <option value="all">All Roles</option>
              <option value="student">Students</option>
              <option value="staff">Staff</option>
              {!isInnovationCell && (
                <>
                  <option value="innovation">Innovation Cell</option>
                  <option value="principal">Principal</option>
                </>
              )}
              <option value="hod">HOD</option>
            </select>

            <select
              value={filters.department}
              onChange={(e) => handleFilterChange('department', e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400"
            >
              <option value="all">All Departments</option>
              {departments.map((dept) => (
                <option key={dept._id} value={dept._id}>
                  {dept.name}
                </option>
              ))}
            </select>
          </div>
        </motion.div>

        {/* Users Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl shadow-lg overflow-hidden"
        >
          <div className="bg-gradient-to-r from-yellow-500 to-blue-500 p-6 text-white">
            <h2 className="text-2xl font-bold">
              User Directory ({pagination.total || 0} users)
            </h2>
            <p className="text-yellow-100 mt-1">
              Click on any user to view detailed analytics and reports
            </p>
          </div>

          {loading ? (
            <div className="p-8 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading users...</p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">
                        User Information
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">
                        Role & Status
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">
                        Department & Class
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">
                        Contact Details
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-100">
                    {users.map((user, index) => (
                      <motion.tr
                        key={user._id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="hover:bg-gradient-to-r hover:from-gray-50 hover:to-blue-50 transition-all duration-200 cursor-pointer"
                        onClick={() => handleViewDetails(user._id)}
                      >
                        <td className="px-6 py-5">
                          <div className="flex items-center">
                            <div className="h-12 w-12 bg-gradient-to-br from-yellow-400 to-blue-500 rounded-full flex items-center justify-center shadow-lg">
                              {getRoleIcon(user.role)}
                            </div>
                            <div className="ml-4">
                              <div className="text-lg font-semibold text-gray-900">
                                {user.name}
                              </div>
                              <div className="text-sm text-gray-600 font-medium">
                                {user.rollNumber || user.email}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {getRoleBadge(user.role)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {user.department?.name || 'N/A'}
                          </div>
                          {user.class?.name && (
                            <div className="text-sm text-gray-500">
                              Class: {user.class.name}
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {user.email}
                          </div>
                          <div className="text-sm text-gray-500">
                            {user.phone || 'No phone'}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleViewDetails(user._id);
                            }}
                            className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-yellow-500 to-blue-500 text-white text-sm font-semibold rounded-xl hover:from-yellow-600 hover:to-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 transform hover:scale-105 transition-all duration-200 shadow-lg"
                          >
                            <EyeIcon className="h-4 w-4 mr-2" />
                            View Report
                          </button>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {pagination.pages > 1 && (
                <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
                  <div className="text-sm text-gray-700">
                    Showing page {pagination.current} of {pagination.pages} (
                    {pagination.total} total users)
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handlePageChange(pagination.current - 1)}
                      disabled={!pagination.hasPrev}
                      className="px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <ChevronLeftIcon className="h-4 w-4" />
                    </button>
                    <span className="px-3 py-2 text-sm font-medium text-gray-700">
                      {pagination.current}
                    </span>
                    <button
                      onClick={() => handlePageChange(pagination.current + 1)}
                      disabled={!pagination.hasNext}
                      className="px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <ChevronRightIcon className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              )}
            </>
          )}

          {/* Empty State */}
          {!loading && users.length === 0 && (
            <div className="text-center py-16">
              <UserIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                No Users Found
              </h3>
              <p className="text-gray-600">
                Try adjusting your search or filters to find users.
              </p>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default Reports;
