// Role-based access control helper
export const getRoleRoutes = (role) => {
  const routes = {
    superadmin: ['/super-admin/*'],
    principal: ['/principal/*'],
    innovation: ['/innovation-cell/*'],
    hod: ['/hod/*'],
    staff: ['/staff/*'],
    student: ['/student/*']
  };
  return routes[role] || [];
};

// Check if user has required role/permissions
export const hasPermission = (userRole, allowedRoles) => {
  return allowedRoles.includes(userRole);
};

// Get dashboard path based on role
export const getDashboardPath = (role) => {
  const paths = {
    superadmin: '/super-admin/dashboard',
    principal: '/principal/dashboard',
    innovation: '/innovation-cell/dashboard',
    hod: '/hod/dashboard',
    staff: '/staff/dashboard',
    student: '/student/dashboard'
  };
  return paths[role] || '/login';
};
