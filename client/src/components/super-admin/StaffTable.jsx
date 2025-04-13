// components/super-admin/StaffTable.jsx
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { PencilSquareIcon, UserGroupIcon, TrashIcon } from '@heroicons/react/24/outline';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const StaffTable = ({ staff, onEdit, onToggleActive, onDelete }) => {
  console.log("This is staff Table");
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredStaff, setFilteredStaff] = useState([]);
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
  useEffect(() => {
    if (staff) {
      setFilteredStaff(
        staff.filter((user) =>
          user.name.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }
  }, [staff, searchTerm]);

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
          placeholder="🔍 Search staff..."
          className="flex-1 px-4 py-3 rounded-2xl border border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-50/50 bg-white shadow-sm text-sm"
        />
      </div>

      <div className="rounded-xl overflow-hidden">
        <table className="w-full whitespace-nowrap">
          <thead className="bg-gray-50">
            <tr className="text-left">
              <th className="py-4 px-6 font-semibold text-gray-700">Name</th>
              <th className="py-4 px-6 font-semibold text-gray-700">Email</th>
              <th className="py-4 px-6 font-semibold text-gray-700">Role</th>
              <th className="py-4 px-6 font-semibold text-gray-700">
                Department
              </th>
              <th className="py-4 px-6 font-semibold text-gray-700">Status</th>
              <th className="py-4 px-6 font-semibold text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filteredStaff.map((user) => (
              <tr key={user._id}>
                <td className="py-4 px-6">
                  <Link
                    to={`${redirectPath}/staff/${user.department._id}/${user._id}`}
                    className="text-blue-600 hover:text-blue-800 font-medium flex items-center space-x-2"
                  >
                    <span>{user.name}</span>
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
                <td className="py-4 px-6">{user.email}</td>
                <td className="py-4 px-6 capitalize">
                  <span className="px-2 py-1 text-xs font-medium rounded-full bg-purple-100 text-purple-800">
                    {user.role}
                  </span>
                </td>
                <td className="py-4 px-6">{user.department?.name || '-'}</td>
                <td className="py-4 px-6">
                  <button
                    onClick={() => onToggleActive(user._id)}
                    className={`relative w-12 h-6 rounded-full transition-colors duration-200 ${
                      user.isActive ? 'bg-green-500' : 'bg-gray-300'
                    }`}
                  >
                    <span
                      className={`absolute left-0 top-0.5 w-5 h-5 bg-white rounded-full shadow-md transform transition-transform duration-200 ${
                        user.isActive ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </td>
                <td className="py-4 px-6 flex space-x-2">
                  <button
                    onClick={() => onEdit(user)}
                    className="p-2 bg-blue-100 rounded-lg hover:bg-blue-200 transition-colors"
                  >
                    <PencilSquareIcon className="w-6 h-6 text-blue-600" />
                  </button>
                  <button
                    onClick={() => onDelete(user._id)}
                    className="p-2 bg-red-100 rounded-lg hover:bg-red-200 transition-colors"
                  >
                    <TrashIcon className="w-6 h-6 text-red-600" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
};

export default StaffTable;
