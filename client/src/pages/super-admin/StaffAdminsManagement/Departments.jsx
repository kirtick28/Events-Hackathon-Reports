import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import DepartmentCard from '../../../components/super-admin/DepartmentCard';
import { PlusIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import api from '../../../utils/api';
import { toast } from 'react-toastify';
import { DocumentTextIcon } from '@heroicons/react/24/outline';

const Departments = () => {
  const [departments, setDepartments] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [newDepartment, setNewDepartment] = useState({
    name: '',
    description: '',
    category: 'non-student'
  });
  const [editingDepartment, setEditingDepartment] = useState(null);

  // Fetch all departments
  const fetchDepartments = async () => {
    try {
      const response = await api.get('/departments');
      setDepartments(response.data);
    } catch (err) {
      console.error('Failed to fetch departments:', err);
    }
  };

  useEffect(() => {
    fetchDepartments();
  }, []);

  const filteredDepartments = departments.filter((dept) =>
    dept.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSubmitDepartment = async () => {
    try {
      if (editingDepartment) {
        await api.put(`/departments/${editingDepartment.id}`, newDepartment);
      } else {
        await api.post('/departments/create-department', newDepartment);
      }

      setShowModal(false);
      setNewDepartment({ name: '', description: '', category: 'non-student' });
      setEditingDepartment(null);
      fetchDepartments();
      toast.success('Department created/updated successfully');
    } catch (error) {
      console.error('Error creating/updating department:', error);
      toast.error('Error creating/updating department');
    }
  };

  const handleDeleteDepartment = async () => {
    try {
      await api.delete(`/departments/${editingDepartment.id}`);
      setShowModal(false);
      setEditingDepartment(null);
      fetchDepartments();
      toast.success('Department deleted successfully');
    } catch (error) {
      console.error('Error deleting department:', error);
      toast.error('Error deleting department');
    }
  };

  const handleEdit = (department) => {
    setEditingDepartment(department);
    setNewDepartment({
      name: department.name,
      description: department.description,
      category: department.category
    });
    setShowModal(true);
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
          <div className="flex-1 max-w-xl relative">
            <MagnifyingGlassIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search staff departments..."
              className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 bg-gray-50"
            />
          </div>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => {
              setNewDepartment({
                name: '',
                description: '',
                category: 'non-student'
              });
              setEditingDepartment(null);
              setShowModal(true);
            }}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-yellow-500 to-blue-500 text-white rounded-xl font-medium shadow-md hover:shadow-lg transition-shadow"
          >
            <PlusIcon className="h-5 w-5" />
            Create Department
          </motion.button>
        </motion.div>

        {/* Departments Grid */}
        <AnimatePresence mode="wait">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {filteredDepartments.length > 0 ? (
              filteredDepartments.map((department) => (
                <DepartmentCard
                  key={department.id}
                  department={department}
                  onEdit={handleEdit}
                  isStaffContext={true}
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
                    No Staff Departments Found
                  </h3>
                  <p className="text-gray-600">
                    Try adjusting your search criteria or create a new department
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
              <h2 className="text-2xl font-semibold text-gray-900">
                {editingDepartment ? 'Edit Department' : 'Create New Department'}
              </h2>

              <div className="space-y-6">
                {/* Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Department Name
                  </label>
                  <input
                    type="text"
                    value={newDepartment.name}
                    onChange={(e) =>
                      setNewDepartment({ ...newDepartment, name: e.target.value })
                    }
                    className="w-full px-4 py-3.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 bg-white shadow-sm text-base"
                    placeholder="Enter department name"
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    value={newDepartment.description}
                    onChange={(e) =>
                      setNewDepartment({
                        ...newDepartment,
                        description: e.target.value
                      })
                    }
                    rows={3}
                    className="w-full px-4 py-3.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 bg-white shadow-sm text-base"
                    placeholder="Enter department description"
                  />
                </div>

                {/* Category */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category
                  </label>
                  <select
                    value={newDepartment.category}
                    onChange={(e) =>
                      setNewDepartment({
                        ...newDepartment,
                        category: e.target.value
                      })
                    }
                    className="w-full px-4 py-3.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 bg-white shadow-sm text-base appearance-none pr-10"
                  >
                    <option value="non-student">Non-Student</option>
                    <option value="student">Student</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-4 pt-4">
                {editingDepartment && (
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleDeleteDepartment}
                    className="px-6 py-3.5 bg-red-600 text-white rounded-xl font-medium hover:bg-red-700 transition-colors shadow-md hover:shadow-lg"
                  >
                    Delete Department
                  </motion.button>
                )}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    setShowModal(false);
                    setEditingDepartment(null);
                    setNewDepartment({
                      name: '',
                      description: '',
                      category: 'non-student'
                    });
                  }}
                  className="px-6 py-3.5 bg-gray-200 text-gray-800 rounded-xl font-medium hover:bg-gray-300 transition-colors shadow-md hover:shadow-lg"
                >
                  Cancel
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleSubmitDepartment}
                  className="px-6 py-3.5 bg-gradient-to-r from-yellow-500 to-blue-500 text-white rounded-xl font-medium shadow-md hover:shadow-lg transition-shadow"
                >
                  {editingDepartment ? 'Update' : 'Create'} Department
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Departments;
