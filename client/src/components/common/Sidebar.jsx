import React from 'react';
import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  HomeIcon,
  UsersIcon,
  BriefcaseIcon,
  UserCircleIcon,
  ArrowRightOnRectangleIcon,
  CalendarIcon,
  ClipboardDocumentListIcon,
  CheckCircleIcon,
  ChartBarIcon,
  BellIcon
} from '@heroicons/react/24/outline';
import { useAuth } from '../../contexts/AuthContext';

const roleConfig = {
  superadmin: [
    { name: 'Dashboard', path: '/super-admin/dashboard', icon: HomeIcon },
    {
      name: 'Student Management',
      path: '/super-admin/students',
      icon: UsersIcon
    },
    {
      name: 'Staff/Admins Management',
      path: '/super-admin/staff',
      icon: BriefcaseIcon
    }
  ],
  innovation: [
    { name: 'Dashboard', path: '/innovation-cell/dashboard', icon: HomeIcon },
    { name: 'Events', path: '/innovation-cell/events', icon: CalendarIcon },
    {
      name: 'Team Approvals',
      path: '/innovation-cell/team/approvals',
      icon: CheckCircleIcon
    },
    {
      name: 'Student Management',
      path: '/innovation-cell/students',
      icon: UsersIcon
    },
    {
      name: 'Staff Management',
      path: '/innovation-cell/staff',
      icon: BriefcaseIcon
    },
    {
      name: 'Reports',
      path: '/innovation-cell/reports',
      icon: ChartBarIcon
    },
    {
      name: 'Notifications',
      path: '/innovation-cell/notifications',
      icon: BellIcon
    }
  ],
  hod: [
    { name: 'Dashboard', path: '/hod/dashboard', icon: HomeIcon },
    { name: 'Events', path: '/hod/events', icon: CalendarIcon },
    {
      name: 'Student Management',
      path: '/hod/students/:deptId',
      icon: UsersIcon
    },
    {
      name: 'Staff Management',
      path: '/hod/staff/:deptId',
      icon: BriefcaseIcon
    }
  ],
  staff: [
    { name: 'Dashboard', path: '/staff/dashboard', icon: HomeIcon },
    { name: 'Events', path: '/staff/events', icon: CalendarIcon },
    {
      name: 'Student Management',
      path: '/staff/students/:deptId/:classId',
      icon: UsersIcon
    }
  ]
};

const basePaths = {
  superadmin: '/super-admin',
  principal: '/principal',
  innovation: '/innovation-cell',
  hod: '/hod',
  staff: '/staff',
  student: '/student'
};

const Sidebar = ({ role }) => {
  const { user, logout } = useAuth();
  const deptId = user?.department || '';
  const classId = user?.class || '';
  const classDepartment = user?.classDepartment || '';

  let navItems = [...(roleConfig[role] || [])];

  // Special handling for staff role - remove Student Management if not advisor
  if (role === 'staff') {
    navItems = navItems.filter((item) => {
      if (item.path.includes(':deptId') && item.path.includes(':classId')) {
        return !!classId; // only include if classId exists
      }
      return true;
    });

    navItems = navItems.map((item) => {
      if (item.path.includes(':deptId') && item.path.includes(':classId')) {
        return {
          ...item,
          path: item.path
            .replace(':deptId', classDepartment)
            .replace(':classId', classId)
        };
      }
      return item;
    });
  }

  // HOD dept ID replacement
  if (role === 'hod') {
    navItems = navItems.map((item) => {
      if (item.path.includes(':deptId')) {
        return {
          ...item,
          path: item.path.replace(':deptId', deptId)
        };
      }
      return item;
    });
  }

  // Add profile as last item
  navItems.push({
    name: 'Profile',
    path: `${basePaths[role] || ''}/profile`,
    icon: UserCircleIcon
  });

  return (
    <motion.aside
      initial={{ x: -20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      className="fixed top-0 left-0 h-full w-64 flex flex-col bg-gradient-to-b from-primary/10 to-white backdrop-blur-lg border-r border-gray-200 shadow-xl p-6 overflow-hidden"
    >
      {/* Brand */}
      <div className="mb-8 flex items-center px-2">
        <span className="text-2xl font-bold text-primary tracking-wide">
          Hackathon
        </span>
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden space-y-2 pr-1">
        {navItems.map((item) => (
          <motion.div
            key={item.name}
            whileHover={{ scale: 1.03 }}
            transition={{ type: 'spring', stiffness: 300 }}
          >
            <NavLink
              to={item.path}
              className={({ isActive }) =>
                `w-full flex items-center space-x-3 p-3 rounded-lg transition-all duration-200 ${
                  isActive
                    ? 'bg-primary-500/20 text-primary-700 font-semibold shadow-sm border-l-4 border-primary-500'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-primary-600'
                }`
              }
            >
              <item.icon className="h-5 w-5 stroke-current" />
              <span className="text-sm font-medium">{item.name}</span>
            </NavLink>
          </motion.div>
        ))}
      </div>

      {/* Logout */}
      <div className="pt-4 border-t border-gray-200">
        <button
          onClick={logout}
          className="w-full flex items-center space-x-3 p-3 text-sm text-gray-700 hover:bg-gray-100 hover:text-red-600 rounded-lg transition-all duration-200"
        >
          <ArrowRightOnRectangleIcon className="h-5 w-5" />
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </motion.aside>
  );
};

export default Sidebar;
