// components/super-admin/StudentTable.jsx
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { PencilSquareIcon, TrashIcon } from '@heroicons/react/24/outline';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const StudentTable = ({ students, onEdit, onToggleActive, onDelete }) => {
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

  const [searchTerm, setSearchTerm] = useState('');
  const [filteredStudents, setFilteredStudents] = useState([]);

  const isStaff = user.role === 'staff';

  useEffect(() => {
    if (students) {
      setFilteredStudents(
        students.filter((student) =>
          student.name.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }
  }, [students, searchTerm]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-white rounded-2xl shadow-lg p-6"
    >
      <div className="flex items-center mb-6">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="🔍 Search students..."
          className="flex-1 px-4 py-3 rounded-2xl border border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-50/50 bg-white shadow-sm text-sm"
        />
      </div>

      <div className="rounded-xl overflow-hidden">
        <table className="w-full whitespace-nowrap">
          <thead className="bg-gray-50">
            <tr className="text-left">
              <th className="py-4 px-6 font-semibold text-gray-700">Name</th>
              <th className="py-4 px-6 font-semibold text-gray-700">Email</th>
              <th className="py-4 px-6 font-semibold text-gray-700">
                Department
              </th>
              <th className="py-4 px-6 font-semibold text-gray-700">Class</th>
              <th className="py-4 px-6 font-semibold text-gray-700">Status</th>
              {!isStaff && (
                <th className="py-4 px-6 font-semibold text-gray-700">
                  Actions
                </th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filteredStudents.map((student) => (
              <tr key={student._id}>
                <td className="py-4 px-6">
                  <Link
                    to={`${redirectPath}/students/${student.department._id}/${student.class._id}/${student._id}`}
                    className="text-blue-600 hover:text-blue-800 font-medium flex items-center space-x-2"
                  >
                    <span>{student.name}</span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17 8l4 4m0 0l-4 4m4-4H3"
                      />
                    </svg>
                  </Link>
                </td>
                <td className="py-4 px-6">{student.email}</td>
                <td className="py-4 px-6">{student.department?.name || '-'}</td>
                <td className="py-4 px-6">{student.class?.name || '-'}</td>
                <td className="py-4 px-6">
                  <div
                    title={
                      isStaff ? 'Only admins can change student status' : ''
                    }
                    className={`relative w-12 h-6 rounded-full transition-colors duration-200 ${
                      student.isActive ? 'bg-green-500' : 'bg-gray-300'
                    } ${isStaff ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                    onClick={() => {
                      if (!isStaff) onToggleActive(student._id);
                    }}
                  >
                    <span
                      className={`absolute left-0 top-0.5 w-5 h-5 bg-white rounded-full shadow-md transform transition-transform duration-200 ${
                        student.isActive ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </div>
                </td>
                {!isStaff && (
                  <td className="py-4 px-6 flex space-x-2">
                    <button
                      onClick={() => onEdit(student)}
                      className="p-2 bg-blue-100 rounded-lg hover:bg-blue-200 transition-colors"
                    >
                      <PencilSquareIcon className="w-6 h-6 text-blue-600" />
                    </button>
                    <button
                      onClick={() => onDelete(student._id)}
                      className="p-2 bg-red-100 rounded-lg hover:bg-red-200 transition-colors"
                    >
                      <TrashIcon className="w-6 h-6 text-red-600" />
                    </button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
};

export default StudentTable;
