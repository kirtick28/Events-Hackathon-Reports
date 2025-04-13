// src/pages/super-admin/StudentManagement/DepartmentClasses.jsx
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import ClassCard from '../../../components/super-admin/ClassCard';
import { PlusIcon, MagnifyingGlassIcon, DocumentTextIcon, AcademicCapIcon, ArrowLeftIcon } from '@heroicons/react/24/outline';
import api from '../../../utils/api';
import { toast } from 'react-toastify';
import { useAuth } from '../../../contexts/AuthContext';
import Select from 'react-select';

const DepartmentClasses = () => {
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
  
  // State for department name
  const [departmentName, setDepartmentName] = useState('');

  // State for classes list
  const [classes, setClasses] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedYear, setSelectedYear] = useState('all');

  // State for create/edit modal
  const [showModal, setShowModal] = useState(false);
  const [newClass, setNewClass] = useState({
    name: '',
    year: 1,
    department: deptId
  });
  const [editingClass, setEditingClass] = useState(null);
  const [staffOptions, setStaffOptions] = useState([]);
  const [selectedAdvisors, setSelectedAdvisors] = useState([]);

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

  // Fetch classes for this department
  const fetchClasses = async () => {
    try {
      const response = await api.get(`/classes?departmentId=${deptId}`);
      console.log(response.data);
      // Attach a fallback name for department if needed
      const classesWithDept = response.data.map((cls) => ({
        ...cls,
        studentCount: cls.studentCount || 0,
        department: {
          id: cls.department,
          name: departmentName || ''
        }
      }));
      setClasses(classesWithDept);
    } catch (err) {
      console.error('Failed to fetch classes:', err);
      toast.error('Failed to fetch classes');
    }
  };

  // Fetch staff members based on whether we're creating or editing
  const fetchStaffOptions = async () => {
    try {
      // Call the API with ne_advisor true so that staff already acting as advisors elsewhere are excluded.
      const response = await api.get(`/users/dropdown?role=staff&ne_advisor=true`);
      
      let options = response.data.map(staff => ({
        value: staff.id,
        label: staff.name,
        department: staff.department,
        class: staff.class
      }));

      // If editing, add the advisors already assigned to this class back into the options (if they're not already in the list)
      if (editingClass && editingClass.advisors) {
        const advisorOptions = editingClass.advisors.map(advisor => ({
          value: advisor._id,
          label: advisor.name
        }));
        
        // Add the advisors that are not present in the API response (since they were excluded by ne_advisor)
        const advisorIds = new Set(options.map(o => o.value));
        advisorOptions.forEach(option => {
          if (!advisorIds.has(option.value)) {
            options.push(option);
          }
        });
      }

      setStaffOptions(options);
    } catch (err) {
      console.error('Failed to fetch staff options:', err);
      toast.error('Failed to load staff members');
    }
  };

  // Combined fetch on mount and whenever deptId changes
  useEffect(() => {
    fetchDepartment();
    // Delay classes fetch until departmentName is set, or just fetch both
    fetchClasses();
  }, [deptId]);

  // Fetch staff options when modal opens
  useEffect(() => {
    if (showModal) {
      fetchStaffOptions();
      
      // If editing, set the selected advisors
      if (editingClass && editingClass.advisors) {
        const advisorOptions = editingClass.advisors.map(advisor => ({
          value: advisor._id,
          label: advisor.name
        }));
        setSelectedAdvisors(advisorOptions);
      } else {
        setSelectedAdvisors([]);
      }
    }
  }, [showModal, editingClass]);

  // Filter classes by search term and year
  const filteredClasses = classes.filter((cls) => {
    const matchesSearch = cls.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesYear =
      selectedYear === 'all' || cls.year === parseInt(selectedYear, 10);
    return matchesSearch && matchesYear;
  });

  // Update newClass state when editing
  const handleEdit = (classData) => {
    setEditingClass(classData);
    setNewClass({
      name: classData.name,
      year: classData.year,
      department: deptId,
      advisors: classData.advisors || []
    });
    setShowModal(true);
  };

  // Create or update class
  const handleSubmitClass = async () => {
    try {
      const payload = {
        ...newClass,
        advisors: selectedAdvisors.map(advisor => advisor.value)
      };

      if (editingClass) {
        await api.put(`/classes/${editingClass._id}`, payload);
        toast.success('Class updated successfully');
      } else {
        await api.post('/classes/create-class', payload);
        toast.success('Class created successfully');
      }
      setShowModal(false);
      setNewClass({ name: '', year: 1, department: deptId, advisors: [] });
      setSelectedAdvisors([]);
      setEditingClass(null);
      fetchClasses();
    } catch (error) {
      console.error('Error creating/updating class:', error);
      toast.error(`Error: ${error.response?.data?.error || error.message}`);
    }
  };

  // Delete class
  const handleDeleteClass = async () => {
    try {
      await api.delete(`/classes/${editingClass._id}`);
      setShowModal(false);
      setEditingClass(null);
      fetchClasses();
      toast.success('Class deleted successfully');
    } catch (error) {
      console.error('Error deleting class:', error);
      toast.error(`Error: ${error.response?.data?.error || error.message}`);
    }
  };

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
              onClick={() => navigate(`${basePath}/students`)}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors whitespace-nowrap"
            >
              <ArrowLeftIcon className="h-5 w-5" />
              <span>Back to Department</span>
            </motion.button>
            <div className="flex-1 max-w-lg relative">
              <MagnifyingGlassIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search classes..."
                className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 bg-gray-50 text-base"
              />
            </div>
          </div>
          <div className="flex items-center gap-4">
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="px-6 py-3.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 bg-gray-50 text-base appearance-none pr-10"
            >
              <option value="all">All Years</option>
              <option value="1">Year I</option>
              <option value="2">Year II</option>
              <option value="3">Year III</option>
              <option value="4">Year IV</option>
            </select>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                setNewClass({ name: '', year: 1, department: deptId });
                setEditingClass(null);
                setSelectedAdvisors([]);
                setShowModal(true);
              }}
              className="flex items-center gap-2 px-6 py-3.5 bg-gradient-to-r from-yellow-500 to-blue-500 text-white rounded-xl font-medium shadow-md hover:shadow-lg transition-shadow whitespace-nowrap"
            >
              <PlusIcon className="h-5 w-5" />
              Create Class
            </motion.button>
          </div>
        </motion.div>

        {/* Department Info Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl p-6 shadow-lg"
        >
          <div className="flex items-center gap-4">
            <div className="p-3 bg-gradient-to-r from-yellow-500 to-blue-500 rounded-xl">
              <AcademicCapIcon className="h-8 w-8 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-semibold text-gray-900">
                {departmentName || 'Department Classes'}
              </h2>
              <p className="text-gray-600">
                Manage and organize classes for this department
              </p>
            </div>
          </div>
        </motion.div>

        {/* Classes Grid */}
        <AnimatePresence mode="wait">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {filteredClasses.length > 0 ? (
              filteredClasses.map((classData) => (
                <ClassCard
                  key={classData._id}
                  classData={classData}
                  onEdit={() => handleEdit(classData)}
                />
              ))
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="col-span-full text-center py-16 bg-white rounded-2xl shadow-lg"
              >
                <div className="max-w-md mx-auto">
                  <DocumentTextIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">
                    No Classes Found
                  </h3>
                  <p className="text-gray-600">
                    Try adjusting your search criteria or create a new class
                  </p>
                </div>
              </motion.div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Modal */}
        {showModal && (
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
              <div className="flex items-center gap-4 mb-6">
                <div className="p-3 bg-gradient-to-r from-yellow-500 to-blue-500 rounded-xl">
                  <AcademicCapIcon className="h-8 w-8 text-white" />
                </div>
                <h2 className="text-2xl font-semibold text-gray-900">
                  {editingClass ? 'Edit Class' : 'Create New Class'}
                </h2>
              </div>

              <div className="space-y-4">
                {/* Class Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Class Name
                  </label>
                  <input
                    type="text"
                    value={newClass.name}
                    onChange={(e) =>
                      setNewClass({ ...newClass, name: e.target.value })
                    }
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-50/50 bg-white shadow-sm text-sm"
                  />
                </div>

                {/* Year */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Year
                  </label>
                  <select
                    value={newClass.year}
                    onChange={(e) =>
                      setNewClass({
                        ...newClass,
                        year: parseInt(e.target.value, 10)
                      })
                    }
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-white shadow-sm text-sm"
                  >
                    <option value="1">Year I</option>
                    <option value="2">Year II</option>
                    <option value="3">Year III</option>
                    <option value="4">Year IV</option>
                  </select>
                </div>

                {/* Advisors Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select Advisors
                  </label>
                  <Select
                    isMulti
                    options={staffOptions}
                    value={selectedAdvisors}
                    onChange={setSelectedAdvisors}
                    className="basic-multi-select"
                    classNamePrefix="select"
                    placeholder="Select advisors..."
                    isClearable
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-4">
                {editingClass && (
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleDeleteClass}
                    className="px-4 py-2 bg-red-600 text-white rounded-xl font-medium hover:bg-red-700 transition-colors shadow-sm"
                  >
                    Delete Class
                  </motion.button>
                )}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    setShowModal(false);
                    setEditingClass(null);
                    setNewClass({ name: '', year: 1, department: deptId });
                    setSelectedAdvisors([]);
                  }}
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded-xl hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleSubmitClass}
                  className="px-4 py-2 bg-gradient-to-r from-yellow-500 to-blue-500 text-white rounded-xl font-medium hover:shadow-lg transition-shadow"
                >
                  {editingClass ? 'Update' : 'Create'} Class
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default DepartmentClasses;
