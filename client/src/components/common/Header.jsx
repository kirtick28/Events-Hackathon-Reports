import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';
import { BellIcon, ChevronDownIcon } from '@heroicons/react/24/outline';

const basePaths = {
  superadmin: '/super-admin',
  principal: '/principal',
  innovation: '/innovation-cell',
  hod: '/hod',
  staff: '/staff',
  student: '/student'
};

const Header = ({ role }) => {
  const { user, logout } = useAuth();
  const [showNotif, setShowNotif] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const notifRef = useRef();
  const menuRef = useRef();

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setShowNotif(false);
      }
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setShowMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="sticky top-0 z-50 bg-white backdrop-blur-md shadow-md border-b border-gray-200"
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
        {/* Title */}
        <h3 className="text-xl font-semibold text-gray-800 capitalize">
          {role} Dashboard
        </h3>

        {/* Icons & Profile */}
        <div className="flex items-center gap-6">
          {/* Notifications */}
          <div className="relative" ref={notifRef}>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowNotif((v) => !v)}
              className="relative p-2 text-gray-600 hover:text-gray-800 focus:outline-none rounded-full hover:bg-gray-100 transition-colors"
            >
              <BellIcon className="h-6 w-6" />
              {/* <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-500 animate-pulse" /> */}
            </motion.button>
            <AnimatePresence>
              {showNotif && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute right-0 mt-2 w-72 bg-white rounded-xl shadow-lg ring-1 ring-black/5 overflow-hidden z-20"
                >
                  <div className="py-2">
                    <p className="px-4 py-2 text-sm text-gray-500">
                      No new notifications
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Profile Dropdown */}
          <div className="relative" ref={menuRef}>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setShowMenu((v) => !v)}
              className="flex items-center gap-3 text-gray-600 hover:text-gray-800 focus:outline-none"
            >
              <div className="h-10 w-10 rounded-full bg-gradient-to-r from-yellow-500 to-blue-500 flex items-center justify-center text-white font-medium uppercase">
                {user?.name?.charAt(0) || '?'}
              </div>
              <div className="text-left hidden sm:block">
                <p className="text-sm font-medium text-gray-700 max-w-[200px] truncate">
                  {user?.name || 'Unknown User'}
                </p>
                <p className="text-xs text-gray-500 capitalize">
                  {role}
                </p>
              </div>
              <ChevronDownIcon className={`h-5 w-5 text-gray-400 transition-transform duration-200 ${showMenu ? 'rotate-180' : ''}`} />
            </motion.button>
            <AnimatePresence>
              {showMenu && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute mt-2 right-0 w-48 bg-white rounded-xl shadow-lg ring-1 ring-black/5 z-20 overflow-hidden"
                >
                  <button
                    onClick={logout}
                    className="block w-full px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 text-left transition-colors"
                  >
                    Logout
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </motion.header>
  );
};

export default Header;
