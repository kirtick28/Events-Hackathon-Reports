import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate
} from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { AuthProvider, useAuth } from './contexts/AuthContext';
import RoleBasedRoute from './components/common/RoleBasedRoute';
import {
  SuperAdmin,
  Principal,
  InnovationCell,
  HOD,
  Staff,
  Student
} from './components/common/RoleLayouts';

// auth pages…
import Login from './pages/auth/Login';
import ForgotPassword from './pages/auth/ForgotPassword';
import ResetPassword from './pages/auth/ResetPassword';

// super-admin pages…
import SuperAdminDashboard from './pages/super-admin/Dashboard';
import StudentDepartments from './pages/super-admin/StudentManagement/Departments';
import DepartmentClasses from './pages/super-admin/StudentManagement/DepartmentClasses';
import ClassStudents from './pages/super-admin/StudentManagement/ClassStudents';
import StudentDetails from './pages/super-admin/StudentManagement/StudentDetails';
import StaffDepartments from './pages/super-admin/StaffAdminsManagement/Departments';
import DepartmentStaff from './pages/super-admin/StaffAdminsManagement/DepartmentStaff';
import StaffDetails from './pages/super-admin/StaffAdminsManagement/StaffDetails';
import SuperAdminProfile from './pages/super-admin/Profile';

// innovation-cell pages…
import ICDashboard from './pages/innovation-cell/Dashboard';
import ICProfile from './pages/innovation-cell/Profile';
import Notifications from './pages/innovation-cell/Notifications';
// Innovation cell Student Management
import ICStudentDepartments from './pages/innovation-cell/StudentManagement/Departments';
import ICDepartmentClasses from './pages/innovation-cell/StudentManagement/DepartmentClasses';
import ICClassStudents from './pages/innovation-cell/StudentManagement/ClassStudents';
import ICStudentDetails from './pages/innovation-cell/StudentManagement/StudentDetails';
// Innovation cell Staff Management
import ICStaffDepartments from './pages/innovation-cell/StaffAdminsManagement/Departments';
import ICDepartmentStaff from './pages/innovation-cell/StaffAdminsManagement/DepartmentStaff';
import ICStaffDetails from './pages/innovation-cell/StaffAdminsManagement/StaffDetails';
// Innovation cell Event Management
import ICEvents from './pages/innovation-cell/EventManagement/AllEvents';
import ICCreateEvent from './pages/innovation-cell/EventManagement/CreateEvent';
import ICEventDetails from './pages/innovation-cell/EventManagement/EventDetails';
import ICEventRequests from './pages/innovation-cell/EventManagement/EventRequests';
// Innovation cell Team Management
import TeamDetails from './pages/innovation-cell/TeamManagement/TeamDetails';
import TeamApprovals from './pages/innovation-cell/TeamManagement/TeamApprovals';
// Innovation cell Reports Management
import Overview from './pages/innovation-cell/Reports/Overview';

// HOD pages…
import HODDashboard from './pages/hod/Dashboard';
import HODProfile from './pages/hod/Profile.jsx';
// HOD Student Management
import HODDepartmentClasses from './pages/hod/StudentManagement/DepartmentClasses';
import HODClassStudents from './pages/hod/StudentManagement/ClassStudents';
import HODStudentDetails from './pages/hod/StudentManagement/StudentDetails';
// HOD Staff Management
import HODDepartmentStaff from './pages/hod/StaffManagement/DepartmentStaffs';
import HODStaffDetails from './pages/hod/StaffManagement/StaffDetails';
// HOD Event Management
import HODEvents from './pages/hod/EventManagement/AllEvents';
import HODEventRequests from './pages/hod/EventManagement/EventRequests';
import HODEventDetails from './pages/hod/EventManagement/EventDetails';

// Staff Pages
import StaffDashboard from './pages/staff/Dashboard';
import StaffProfile from './pages/staff/Profile';
import StaffEvents from './pages/staff/Events';
import StaffMentoredTeams from './pages/staff/MentoredTeams';
// Staff Student Management
import StaffClassStudents from './pages/staff/advisor/ClassStudents';
import StaffStudentDetails from './pages/staff/advisor/StudentDetails';
import StaffProofVerification from './pages/staff/advisor/ProofVerification';
import StaffClassReports from './pages/staff/advisor/ClassReports';
import StaffPastClassData from './pages/staff/advisor/PastClassData';
import HomePage from './pages/auth/HomePage';

const RedirectIfLoggedIn = ({ children }) => {
  const { user } = useAuth();
  if (user) {
    const redirectPath =
      {
        superadmin: '/super-admin',
        principal: '/principal',
        innovation: '/innovation-cell',
        hod: '/hod',
        staff: '/staff',
        student: '/student'
      }[user.role] || '/';
    return <Navigate to={redirectPath} replace />;
  }
  return children;
};

const App = () => (
  <Router>
    <AuthProvider>
      <ToastContainer />

      <Routes>
        {/* Auth */}
        <Route path="/home" element={<HomePage />} />

        <Route
          path="/login"
          element={
            <RedirectIfLoggedIn>
              <Login />
            </RedirectIfLoggedIn>
          }
        />
        <Route
          path="/forgot-password"
          element={
            <RedirectIfLoggedIn>
              <ForgotPassword />
            </RedirectIfLoggedIn>
          }
        />
        <Route
          path="/reset-password/:token"
          element={
            <RedirectIfLoggedIn>
              <ResetPassword />
            </RedirectIfLoggedIn>
          }
        />

        {/* Super Admin */}
        <Route
          path="/super-admin"
          element={
            <RoleBasedRoute allowedRoles={['superadmin']}>
              <SuperAdmin />
            </RoleBasedRoute>
          }
        >
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<SuperAdminDashboard />} />

          {/* students */}
          <Route path="students">
            <Route index element={<StudentDepartments />} />
            <Route path=":deptId">
              <Route index element={<DepartmentClasses />} />
              <Route path=":classId">
                <Route index element={<ClassStudents />} />
                <Route path=":studentId" element={<StudentDetails />} />
              </Route>
            </Route>
          </Route>

          {/* staff/admins */}
          <Route path="staff">
            <Route index element={<StaffDepartments />} />
            <Route path=":deptId">
              <Route index element={<DepartmentStaff />} />
              <Route path=":staffId" element={<StaffDetails />} />
            </Route>
          </Route>

          <Route path="profile" element={<SuperAdminProfile />} />
          <Route path="*" element={<Navigate to="dashboard" replace />} />
        </Route>

        {/* Innovation Cell */}
        <Route
          path="/innovation-cell"
          element={
            <RoleBasedRoute allowedRoles={['innovation']}>
              <InnovationCell />
            </RoleBasedRoute>
          }
        >
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<ICDashboard />} />
          {/* students (re‑used) */}
          <Route path="students">
            <Route index element={<ICStudentDepartments />} />
            <Route path=":deptId">
              <Route index element={<ICDepartmentClasses />} />
              <Route path=":classId">
                <Route index element={<ICClassStudents />} />
                <Route path=":studentId" element={<ICStudentDetails />} />
              </Route>
            </Route>
          </Route>
          {/* staff/admins (re‑used) */}
          <Route path="staff">
            <Route index element={<ICStaffDepartments />} />
            <Route path=":deptId">
              <Route index element={<ICDepartmentStaff />} />
              <Route path=":staffId" element={<ICStaffDetails />} />
            </Route>
          </Route>
          {/* events */}
          <Route path="events">
            <Route index element={<ICEvents />} />
            <Route path="create" element={<ICCreateEvent />} />
            <Route path="requests" element={<ICEventRequests />} />
            <Route
              path=":eventId/edit"
              element={<ICCreateEvent mode="edit" />}
            />
            <Route path=":eventId" element={<ICEventDetails />} />
          </Route>
          {/* Team */}
          <Route path="team">
            <Route index element={<TeamDetails />} />
            <Route path="approvals" element={<TeamApprovals />} />
          </Route>
          {/* Reports */}
          <Route path="reports">
            <Route index element={<Overview />} />
          </Route>
          <Route path="notifications" element={<Notifications />} />
          <Route path="profile" element={<ICProfile />} />
          <Route path="*" element={<Navigate to="dashboard" replace />} />
        </Route>

        {/* HOD */}
        <Route
          path="/hod"
          element={
            <RoleBasedRoute allowedRoles={['hod']}>
              <HOD />
            </RoleBasedRoute>
          }
        >
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<HODDashboard />} />

          {/* Students Management */}
          <Route path="students">
            <Route path=":deptId">
              <Route index element={<HODDepartmentClasses />} />
              <Route path=":classId">
                <Route index element={<HODClassStudents />} />
                <Route path=":studentId" element={<HODStudentDetails />} />
              </Route>
            </Route>
          </Route>

          {/* Staff Management */}
          <Route path="staff">
            <Route path=":deptId">
              <Route index element={<HODDepartmentStaff />} />
              <Route path=":staffId" element={<HODStaffDetails />} />
            </Route>
          </Route>

          {/* Events Management */}
          <Route path="events">
            <Route index element={<HODEvents />} />
            <Route path="create" element={<HODEventRequests />} />
            <Route
              path=":eventId/edit"
              element={<HODEventRequests mode="edit" />}
            />
            <Route path=":eventId" element={<HODEventDetails />} />
          </Route>

          <Route path="profile" element={<HODProfile />} />
          <Route path="*" element={<Navigate to="dashboard" replace />} />
        </Route>

        {/* Staff */}
        <Route
          path="/staff"
          element={
            <RoleBasedRoute allowedRoles={['staff']}>
              <Staff />
            </RoleBasedRoute>
          }
        >
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<StaffDashboard />} />
          <Route path="profile" element={<StaffProfile />} />
          <Route path="events" element={<StaffEvents />} />
          <Route path="mentored-teams" element={<StaffMentoredTeams />} />
          {/* Student Management */}
          {/* <Route path="students">
            <Route path=":deptId/:classId">
              <Route index element={<StaffClassStudents />} />
              <Route path=":studentId" element={<StaffStudentDetails />} />
              <Route
                path=":studentId/reports"
                element={<StaffClassReports />}
              />
              <Route
                path=":studentId/proofs"
                element={<StaffProofVerification />}
              />
            </Route>
            <Route path="past-data" element={<StaffPastClassData />} />
          </Route> */}
          <Route
            path="students/:deptId/:classId"
            element={<StaffClassStudents />}
          />
          <Route
            path="students/:deptId/:classId/:studentId"
            element={<StaffStudentDetails />}
          />
          <Route
            path="students/:deptId/:classId/:studentId/reports"
            element={<StaffClassReports />}
          />
          <Route
            path="students/:deptId/:classId/:studentId/proofs"
            element={<StaffProofVerification />}
          />
          <Route path="students/past-data" element={<StaffPastClassData />} />
        </Route>

        {/* Other roles… */}
        <Route
          path="/principal"
          element={
            <RoleBasedRoute allowedRoles={['principal']}>
              <Principal />
            </RoleBasedRoute>
          }
        />

        <Route
          path="/student"
          element={
            <RoleBasedRoute allowedRoles={['student']}>
              <Student />
            </RoleBasedRoute>
          }
        />

        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AuthProvider>
  </Router>
);

export default App;
