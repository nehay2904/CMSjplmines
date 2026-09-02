import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * Usage:
 *   <ProtectedRoute roles={['admin']}>...</ProtectedRoute>
 *   <ProtectedRoute>...</ProtectedRoute>   // any logged-in user
 */
const ProtectedRoute = ({ children, roles }) => {
  const { user, homeFor } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (roles && !roles.includes(user.role)) {
    return <Navigate to={homeFor(user.role)} replace />;
  }
  return children;
};

export default ProtectedRoute;
