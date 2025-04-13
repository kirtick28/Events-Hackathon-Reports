// src/components/common/RoleBasedRoute.jsx
import { useEffect } from 'react';
import { useNavigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { motion } from 'framer-motion';
import LoadingSpinner from './LoadingSpinner';

const RoleBasedRoute = ({ allowedRoles, children }) => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        navigate('/login');
      } else if (!allowedRoles.includes(user.role)) {
        navigate('/unauthorized');
      }
    }
  }, [user, loading, allowedRoles, navigate]);

  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="min-h-screen flex items-center justify-center bg-primary/5"
      >
        <LoadingSpinner size="xl" />
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      {children || <Outlet />}
    </motion.div>
  );
};

export default RoleBasedRoute;
