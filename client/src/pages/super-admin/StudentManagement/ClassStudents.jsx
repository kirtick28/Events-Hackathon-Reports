// src/pages/super-admin/StudentManagement/ClassStudents.jsx
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import StudentTable from '../../../components/super-admin/StudentTable';
import {
  PlusIcon,
  MagnifyingGlassIcon,
  ArrowLeftIcon
} from '@heroicons/react/24/outline';
import api from '../../../utils/api';
import { toast } from 'react-toastify';
import { useAuth } from '../../../contexts/AuthContext';

const ClassStudents = () => {
  const { deptId, classId } = useParams();
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

  // State for dynamic class info
  const [className, setClassName] = useState('');
  const [classYear, setClassYear] = useState(null);

  // State for students list
  const [students, setStudents] = useState([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showBulkModal, setShowBulkModal] = useState(false);
  const [newStudent, setNewStudent] = useState({
    name: '',
    email: '',
    department: deptId,
    class: classId,
    role: 'student'
  });
  const [editingStudent, setEditingStudent] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isImporting, setIsImporting] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Fetch class info (name & year)
  const fetchClass = async () => {
    try {
      const res = await api.get(`/classes/${classId}`);
      setClassName(res.data.name);
      setClassYear(res.data.year);
    } catch (err) {
      console.error('Failed to fetch class info:', err);
      toast.error('Failed to load class info');
    }
  };

  // Fetch students for this class
  const fetchStudents = async () => {
    try {
      const response = await api.get(
        `/users?department=${deptId}&class=${classId}&role=student`
      );
      setStudents(response.data);
    } catch (err) {
      console.error('Failed to fetch students:', err);
      toast.error('Failed to fetch students');
    }
  };

  useEffect(() => {
    fetchClass();
    fetchStudents();
  }, [deptId, classId]);

  // Create or update student
  const handleSubmitStudent = async () => {
    try {
      if (editingStudent) {
        await api.put(`/users/${editingStudent._id}`, newStudent);
        toast.success('Student updated successfully');
      } else {
        await api.post('/users/create-user', newStudent);
        toast.success('Student created successfully');
      }
      setShowCreateModal(false);
      setNewStudent({
        name: '',
        email: '',
        department: deptId,
        class: classId,
        role: 'student'
      });
      setEditingStudent(null);
      fetchStudents();
    } catch (error) {
      console.error('Error creating/updating student:', error);
      toast.error(`Error: ${error.response?.data?.error || error.message}`);
    }
  };

  // Edit handler
  const handleEdit = (student) => {
    setEditingStudent(student);
    setNewStudent({
      name: student.name,
      email: student.email,
      department: deptId,
      class: classId,
      role: 'student'
    });
    setShowCreateModal(true);
  };

  // Toggle active status
  const handleToggleActive = async (studentId) => {
    try {
      const studentRes = await api.get(`/users/${studentId}`);
      const updated = {
        ...studentRes.data,
        isActive: !studentRes.data.isActive
      };
      await api.put(`/users/${studentId}`, updated);
      fetchStudents();
      toast.success(
        `Student ${updated.isActive ? 'activated' : 'deactivated'}`
      );
    } catch (error) {
      console.error('Error toggling active status:', error);
      toast.error('Failed to update student status');
    }
  };

  // Delete student
  const handleDeleteStudent = async (studentId) => {
    if (
      !window.confirm(
        'Are you sure you want to delete this student? This action cannot be undone.'
      )
    ) {
      return;
    }
    try {
      await api.delete(`/users/${studentId}`);
      toast.success('Student deleted successfully');
      fetchStudents();
    } catch (error) {
      console.error('Error deleting student:', error);
      toast.error(`Error: ${error.response?.data?.error || error.message}`);
    }
  };

  // Bulk import helpers
  const handleFileSelect = (e) => setSelectedFile(e.target.files[0]);

  const handleBulkImport = async () => {
    if (!selectedFile) {
      toast.error('Please select a file first');
      return;
    }
    setIsImporting(true);
    const formData = new FormData();
    formData.append('file', selectedFile);
    formData.append('role', 'student');
    formData.append('department', deptId);
    formData.append('class', classId);

    try {
      await api.post('/users/bulk-add', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      fetchStudents();
      setShowBulkModal(false);
      setSelectedFile(null);
      toast.success('Students imported successfully!');
    } catch (error) {
      console.error('Error importing students:', error);
      toast.error(
        `Import failed: ${error.response?.data?.error || error.message}`
      );
    } finally {
      setIsImporting(false);
    }
  };

  // Filter students based on search term
  const filteredStudents = students.filter((student) =>
    student.name.toLowerCase().includes(searchTerm.toLowerCase())
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
              onClick={() => navigate(`${basePath}/students/${deptId}`)}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors whitespace-nowrap"
            >
              <ArrowLeftIcon className="h-5 w-5" />
              <span>Back to Classes</span>
            </motion.button>
            <div className="flex-1 max-w-lg relative">
              <MagnifyingGlassIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search students..."
                className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 bg-gray-50 text-base"
              />
            </div>
          </div>

          {/* Conditional rendering for buttons */}
          {user.role !== 'staff' && (
            <div className="flex items-center gap-4">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  setNewStudent({
                    name: '',
                    email: '',
                    department: deptId,
                    class: classId,
                    role: 'student'
                  });
                  setEditingStudent(null);
                  setShowCreateModal(true);
                }}
                className="flex items-center gap-2 px-6 py-3.5 bg-gradient-to-r from-yellow-500 to-blue-500 text-white rounded-xl font-medium shadow-md hover:shadow-lg transition-shadow whitespace-nowrap"
              >
                <PlusIcon className="h-5 w-5" />
                Create Student
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
          )}
        </motion.div>

        {/* Student Table */}
        <AnimatePresence mode="wait">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-2xl shadow-lg overflow-hidden"
          >
            <StudentTable
              students={filteredStudents}
              onEdit={handleEdit}
              onToggleActive={handleToggleActive}
              onDelete={handleDeleteStudent}
            />
          </motion.div>
        </AnimatePresence>

        {/* Modals - Only rendered if user has permission */}
        {showCreateModal && user.role !== 'staff' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          >
            {/* ... (keep existing modal content unchanged) */}
          </motion.div>
        )}

        {showBulkModal && user.role !== 'staff' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          >
            {/* ... (keep existing bulk modal content unchanged) */}
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default ClassStudents;
