// src/pages/super-admin/StaffManagement/DepartmentStaff.jsx
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import StaffTable from '../../../components/super-admin/StaffTable';
import { PlusIcon, MagnifyingGlassIcon, ArrowLeftIcon } from '@heroicons/react/24/outline';
import api from '../../../utils/api';
import { toast } from 'react-toastify';
import { useAuth } from '../../../contexts/AuthContext';

const DepartmentStaff = () => {
  const { deptId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const basePath = {
    superadmin: '/super-admin',
    principal: '/principal',
    innovation: '/innovation-cell',
    hod: '/hod',
    staff: '/staff',
    student: '/student'
  }[user.role];

  const [departmentName, setDepartmentName] = useState(''); // ← holds current dept name
  const [staff, setStaff] = useState([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showBulkModal, setShowBulkModal] = useState(false);
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    department: deptId,
    role: 'staff' // Default role
  });
  const [editingUser, setEditingUser] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isImporting, setIsImporting] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Fetch staff list
  const fetchStaff = async () => {
    try {
      const response = await api.get(
        `/users?department=${deptId}&role_ne=student&except_me=true`
      );
      setStaff(response.data);
    } catch (err) {
      console.error('Failed to fetch staff:', err);
      toast.error('Failed to fetch staff members');
    }
  };

  // Fetch department info (name)
  const fetchDepartment = async () => {
    try {
      const res = await api.get(`/departments/${deptId}`);
      setDepartmentName(res.data.name);
    } catch (err) {
      console.error('Failed to fetch department:', err);
      toast.error('Failed to load department info');
    }
  };

  useEffect(() => {
    fetchDepartment();
    fetchStaff();
  }, [deptId]);

  const handleSubmitUser = async () => {
    try {
      if (editingUser) {
        await api.put(`/users/${editingUser._id}`, newUser);
        toast.success('User updated successfully');
      } else {
        await api.post('/users/create-user', newUser);
        toast.success('User created successfully');
      }

      setShowCreateModal(false);
      setNewUser({
        name: '',
        email: '',
        department: deptId,
        role: 'staff'
      });
      setEditingUser(null);
      fetchStaff();
    } catch (error) {
      console.error('Error creating/updating user:', error);
      toast.error(`Error: ${error.response?.data?.error || error.message}`);
    }
  };

  const handleEdit = (user) => {
    setEditingUser(user);
    setNewUser({
      name: user.name,
      email: user.email,
      department: deptId,
      role: user.role
    });
    setShowCreateModal(true);
  };

  const handleToggleActive = async (userId) => {
    try {
      const userRes = await api.get(`/users/${userId}`);
      const updatedUser = {
        ...userRes.data,
        isActive: !userRes.data.isActive
      };
      await api.put(`/users/${userId}`, updatedUser);
      fetchStaff();
      toast.success(
        `User ${updatedUser.isActive ? 'activated' : 'deactivated'}`
      );
    } catch (error) {
      console.error('Error toggling active status:', error);
      toast.error('Failed to update user status');
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      return;
    }
    try {
      await api.delete(`/users/${userId}`);
      toast.success('User deleted successfully');
      fetchStaff();
    } catch (error) {
      console.error('Error deleting user:', error);
      toast.error(`Error: ${error.response?.data?.error || error.message}`);
    }
  };

  const handleFileSelect = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleBulkImport = async () => {
    if (!selectedFile) {
      toast.error('Please select a file first');
      return;
    }

    setIsImporting(true);
    const formData = new FormData();
    formData.append('file', selectedFile);
    formData.append('role', newUser.role);
    formData.append('department', deptId);

    try {
      await api.post('/users/bulk-add', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      fetchStaff();
      setShowBulkModal(false);
      setSelectedFile(null);
      toast.success('Users imported successfully!');
    } catch (error) {
      console.error('Error importing users:', error);
      toast.error(
        `Import failed: ${error.response?.data?.error || error.message}`
      );
    } finally {
      setIsImporting(false);
    }
  };

  const filteredStaff = staff.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-white rounded-2xl p-6 shadow-lg"
        >
          <div className="flex items-center gap-6 w-full">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate(`${basePath}/staff`)}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors whitespace-nowrap"
            >
              <ArrowLeftIcon className="h-5 w-5" />
              <span>Back to Staff</span>
            </motion.button>
            <div className="flex-1 max-w-lg relative">
              <MagnifyingGlassIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search staff members..."
                className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 bg-gray-50 text-base"
              />
            </div>
          </div>
          <div className="flex items-center gap-4">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                setNewUser({
                  name: '',
                  email: '',
                  department: deptId,
                  role: 'staff'
                });
                setEditingUser(null);
                setShowCreateModal(true);
              }}
              className="flex items-center gap-2 px-6 py-3.5 bg-gradient-to-r from-yellow-500 to-blue-500 text-white rounded-xl font-medium shadow-md hover:shadow-lg transition-shadow whitespace-nowrap"
            >
              <PlusIcon className="h-5 w-5" />
              Create Staff
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setShowBulkModal(true)}
              className="flex items-center gap-2 px-6 py-3.5 bg-gradient-to-r from-blue-500 to-yellow-500 text-white rounded-xl font-medium shadow-md hover:shadow-lg transition-shadow whitespace-nowrap"
            >
              <PlusIcon className="h-5 w-5" />
              Bulk Import
            </motion.button>
          </div>
        </motion.div>

        {/* Staff Table */}
        <AnimatePresence mode="wait">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-2xl shadow-lg overflow-hidden"
          >
            <StaffTable
              staff={filteredStaff}
              onEdit={handleEdit}
              onToggleActive={handleToggleActive}
              onDelete={handleDeleteUser}
            />
          </motion.div>
        </AnimatePresence>

        {/* Create/Edit Modal */}
        {showCreateModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-white rounded-2xl p-8 w-full max-w-2xl shadow-xl space-y-6"
            >
              <h2 className="text-2xl font-semibold text-gray-900">
                {editingUser ? 'Edit User' : 'Create New Staff'}
              </h2>

              <div className="space-y-4">
                {/* Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={newUser.name}
                    onChange={(e) =>
                      setNewUser({ ...newUser, name: e.target.value })
                    }
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 bg-white shadow-sm text-sm"
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    value={newUser.email}
                    onChange={(e) =>
                      setNewUser({ ...newUser, email: e.target.value })
                    }
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 bg-white shadow-sm text-sm"
                  />
                </div>

                {/* Role */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Role
                  </label>
                  <select
                    value={newUser.role}
                    onChange={(e) =>
                      setNewUser({ ...newUser, role: e.target.value })
                    }
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 bg-white shadow-sm text-sm"
                  >
                    <option value="staff">Staff</option>
                    <option value="hod">HOD</option>
                    <option value="innovation">Prime Admin</option>
                    <option value="principal">Super Admin</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end space-x-4">
                {editingUser && (
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleDeleteUser(editingUser._id)}
                    className="px-4 py-2 bg-red-600 text-white rounded-xl font-medium hover:bg-red-700 transition-colors shadow-sm"
                  >
                    Delete User
                  </motion.button>
                )}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    setShowCreateModal(false);
                    setEditingUser(null);
                    setNewUser({
                      name: '',
                      email: '',
                      department: deptId,
                      role: 'staff'
                    });
                  }}
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded-xl hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleSubmitUser}
                  className="px-4 py-2 bg-gradient-to-r from-yellow-500 to-blue-500 text-white rounded-xl font-medium hover:shadow-lg transition-shadow"
                >
                  {editingUser ? 'Update' : 'Create'} User
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* Bulk Import Modal */}
        {showBulkModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-white rounded-2xl p-8 w-full max-w-2xl shadow-xl space-y-6"
            >
              <h2 className="text-2xl font-semibold text-gray-900">
                Bulk Import Users
              </h2>

              <div className="space-y-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-sm text-blue-800">
                    <strong>File requirements:</strong>
                    <br />
                    - Excel file (.xlsx, .xls, .csv)
                    <br />
                    - Two columns: "name" and "email" (first row as header)
                    <br />- All users will be added to current department
                  </p>
                </div>

                {/* Role Selector */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select Role
                  </label>
                  <select
                    value={newUser.role}
                    onChange={(e) =>
                      setNewUser({ ...newUser, role: e.target.value })
                    }
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 bg-white shadow-sm text-sm"
                  >
                    <option value="staff">Staff</option>
                    <option value="admin">Admin</option>
                    <option value="innovation">Prime Admin</option>
                    <option value="principal">Super Admin</option>
                  </select>
                </div>

                {/* File Input */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Upload Excel File
                  </label>
                  <input
                    type="file"
                    accept=".xlsx, .xls, .csv"
                    onChange={handleFileSelect}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 bg-white shadow-sm text-sm"
                  />
                  {selectedFile && (
                    <p className="mt-2 text-sm text-gray-600">
                      Selected file: {selectedFile.name}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex justify-end space-x-4">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    setShowBulkModal(false);
                    setSelectedFile(null);
                  }}
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded-xl hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleBulkImport}
                  disabled={!selectedFile || isImporting}
                  className={`px-4 py-2 rounded-xl font-medium transition-colors shadow-sm ${
                    !selectedFile || isImporting
                      ? 'bg-gray-400 text-gray-700 cursor-not-allowed'
                      : 'bg-gradient-to-r from-yellow-500 to-blue-500 text-white hover:shadow-lg'
                  }`}
                >
                  {isImporting ? 'Importing...' : 'Import Users'}
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default DepartmentStaff;
