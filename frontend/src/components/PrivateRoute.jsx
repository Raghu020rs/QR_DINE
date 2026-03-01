import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ children, allowedRole }) => {
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');

  if (!token) {
    // Not logged in, redirect to appropriate login
    return <Navigate to={allowedRole === 'master' ? '/login/master' : '/login/shop'} replace />;
  }

  if (allowedRole && role !== allowedRole) {
    // Wrong role, redirect to appropriate dashboard
    return <Navigate to={role === 'master' ? '/master/dashboard' : '/shop/dashboard'} replace />;
  }

  return children;
};

export default PrivateRoute;
