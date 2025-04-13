import { Outlet } from 'react-router-dom';
import Header from './Header';
import Sidebar from './Sidebar';
import { motion } from 'framer-motion';

const BaseLayout = ({ role, children }) => (
  <div className="flex min-h-screen bg-secondary/10">
    {/* Sidebar with fixed width */}
    <Sidebar role={role} />

    {/* Main content area with proper margin to account for sidebar */}
    <div className="flex-1 flex flex-col ml-64 transition-all duration-300">
      <Header role={role} />
      <motion.main
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex-1 overflow-y-auto"
      >
        {children || <Outlet />}
      </motion.main>
    </div>
  </div>
);

export const SuperAdmin = () => <BaseLayout role="superadmin" />;
export const Principal = () => <BaseLayout role="principal" />;
export const InnovationCell = () => <BaseLayout role="innovation" />;
export const HOD = () => <BaseLayout role="hod" />;
export const Staff = () => <BaseLayout role="staff" />;
export const Student = () => <BaseLayout role="student" />;
