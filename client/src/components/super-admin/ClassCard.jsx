// components/super-admin/ClassCard.jsx
import { motion } from 'framer-motion';
import { PencilSquareIcon, ArrowRightIcon, UserGroupIcon, CalendarIcon } from '@heroicons/react/24/outline';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const ClassCard = ({ classData, onEdit }) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const redirectPath =
    {
      superadmin: '/super-admin',
      principal: '/principal',
      innovation: '/innovation-cell',
      hod: '/hod',
      staff: '/staff',
      student: '/student'
    }[user.role] || '/';

  const deptId = classData.department._id || classData.department.id;
  const classId = classData._id || classData.id;

  const handleNavigate = () => {
    navigate(`${redirectPath}/students/${deptId}/${classId}`);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      className="relative rounded-2xl overflow-hidden bg-white shadow-lg border border-gray-100"
    >
      {/* Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-yellow-50 to-blue-50 opacity-50" />
      
      {/* Content */}
      <div className="relative p-6 flex flex-col h-full">
        {/* Header */}
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-2xl font-bold text-gray-800 mb-1">
              {classData.name}
            </h3>
            <span className="inline-block px-3 py-1 text-xs font-semibold rounded-full bg-gradient-to-r from-yellow-100 to-blue-100 text-gray-700">
              {classData.department.name}
            </span>
          </div>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={(e) => {
              e.stopPropagation();
              onEdit(classData);
            }}
            className="p-2 rounded-full bg-white shadow-sm hover:shadow-md transition-shadow"
          >
            <PencilSquareIcon className="h-5 w-5 text-blue-600" />
          </motion.button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-white p-3 rounded-xl shadow-sm">
            <div className="flex items-center gap-2 mb-1">
              <CalendarIcon className="h-4 w-4 text-yellow-600" />
              <p className="text-sm text-gray-500">Year</p>
            </div>
            <p className="text-xl font-bold text-yellow-600">{classData.year}</p>
          </div>
          <div className="bg-white p-3 rounded-xl shadow-sm">
            <div className="flex items-center gap-2 mb-1">
              <UserGroupIcon className="h-4 w-4 text-blue-600" />
              <p className="text-sm text-gray-500">Students</p>
            </div>
            <p className="text-xl font-bold text-blue-600">{classData.studentCount || 0}</p>
          </div>
        </div>

        {/* Advisors */}
        <div className="mb-6">
          <div className="bg-white p-3 rounded-xl shadow-sm">
            <p className="text-sm text-gray-500 mb-1">Advisors</p>
            <p className="text-lg font-semibold text-gray-700">{classData.advisors?.length || 0}</p>
          </div>
        </div>

        {/* Action Button */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleNavigate}
          className="w-full py-3 px-4 bg-gradient-to-r from-yellow-500 to-blue-500 text-white rounded-xl font-medium flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-shadow"
        >
          View Students
          <ArrowRightIcon className="h-5 w-5" />
        </motion.button>
      </div>
    </motion.div>
  );
};

export default ClassCard;
