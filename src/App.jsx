import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

import Login from './pages/Login';

// admin
import AdminLayout from './pages/admin/AdminLayout';
import Overview from './pages/admin/Overview';
import Compliances from './pages/admin/Compliances';
import AssignTrack from './pages/admin/AssignTrack';
import Users from './pages/admin/Users';
import Mines from './pages/admin/Mines';
import AlertLogView from './components/AlertLogView';

// supervisor
import SupervisorLayout from './pages/supervisor/SupervisorLayout';
import SupervisorDashboard from './pages/supervisor/SupervisorDashboard';
import Team from './pages/supervisor/Team';
import SupReturns from './pages/supervisor/Returns';
import SupNotices from './pages/supervisor/Notices';
import SupRecords from './pages/supervisor/Records';
import Escalations from './pages/supervisor/Escalations';

// user
import UserLayout from './pages/user/UserLayout';
import UserDashboard from './pages/user/UserDashboard';
import MyCompliances from './pages/user/MyCompliances';
import UsrReturns from './pages/user/Returns';
import UsrNotices from './pages/user/Notices';
import UsrRecords from './pages/user/Records';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Toaster position="top-right" />
        <Routes>
          <Route path="/login" element={<Login />} />

          {/* ADMIN */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute roles={['admin']}>
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Overview />} />
            <Route path="compliances" element={<Compliances />} />
            <Route path="assign" element={<AssignTrack />} />
            <Route path="users" element={<Users />} />
            <Route path="mines" element={<Mines />} />
            <Route path="alerts" element={<AlertLogView />} />
          </Route>

          {/* SUPERVISOR */}
          <Route
            path="/supervisor"
            element={
              <ProtectedRoute roles={['supervisor']}>
                <SupervisorLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<SupervisorDashboard />} />
            <Route path="team" element={<Team />} />
            <Route path="returns" element={<SupReturns />} />
            <Route path="notices" element={<SupNotices />} />
            <Route path="records" element={<SupRecords />} />
            <Route path="alerts" element={<Escalations />} />
          </Route>

          {/* USER */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute roles={['user']}>
                <UserLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<UserDashboard />} />
            <Route path="compliances" element={<MyCompliances />} />
            <Route path="returns" element={<UsrReturns />} />
            <Route path="notices" element={<UsrNotices />} />
            <Route path="records" element={<UsrRecords />} />
          </Route>

          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
