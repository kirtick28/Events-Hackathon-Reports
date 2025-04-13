import { motion } from 'framer-motion';
import { PencilSquareIcon, ArrowRightIcon } from '@heroicons/react/24/outline';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const DepartmentCard = ({ department, onEdit, isStaffContext }) => {
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

  const handleNavigate = () => {
    if (isStaffContext) {
      navigate(`${redirectPath}/staff/${department.id}`);
    } else {
      navigate(`${redirectPath}/students/${department.id}`);
    }
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
              {department.name}
            </h3>
            <span className="inline-block px-3 py-1 text-xs font-semibold rounded-full bg-gradient-to-r from-yellow-100 to-blue-100 text-gray-700">
              {isStaffContext ? 'Staff Department' : department.category === 'student' ? 'Student Department' : 'Staff Department'}
            </span>
          </div>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={(e) => {
              e.stopPropagation();
              onEdit(department);
            }}
            className="p-2 rounded-full bg-white shadow-sm hover:shadow-md transition-shadow"
          >
            <PencilSquareIcon className="h-5 w-5 text-blue-600" />
          </motion.button>
        </div>

        {/* Description */}
        <p className="text-gray-600 mb-6 line-clamp-2">
          {department.description}
        </p>

        {/* Stats */}
        <div className="mt-auto">
          <div className="grid grid-cols-2 gap-4 mb-6">
            {isStaffContext ? (
              <div className="bg-white p-3 rounded-xl shadow-sm">
                <p className="text-sm text-gray-500">Staff Members</p>
                <p className="text-xl font-bold text-blue-600">{department.staffCount || 0}</p>
              </div>
            ) : (
              <>
                <div className="bg-white p-3 rounded-xl shadow-sm">
                  <p className="text-sm text-gray-500">Students</p>
                  <p className="text-xl font-bold text-blue-600">{department.studentsCount || 0}</p>
                </div>
                <div className="bg-white p-3 rounded-xl shadow-sm">
                  <p className="text-sm text-gray-500">Classes</p>
                  <p className="text-xl font-bold text-yellow-600">{department.classesCount || 0}</p>
                </div>
              </>
            )}
          </div>

          {/* Action Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleNavigate}
            className="w-full py-3 px-4 bg-gradient-to-r from-yellow-500 to-blue-500 text-white rounded-xl font-medium flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-shadow"
          >
            View Details
            <ArrowRightIcon className="h-5 w-5" />
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

export default DepartmentCard;