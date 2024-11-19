// ProtectedRoute.jsx
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import useAuth from '../hooks/useAuth';

const ProtectedRoute = ({ roles }) => {
  const { user } = useAuth();

  //console.log('ProtectedRoute user:', user);
  //console.log('ProtectedRoute roles:', roles);

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (roles && user.roles) {
    const hasRequiredRole = roles.some(role => user.roles.map(r => r.role.toLowerCase()).includes(role.toLowerCase()));
    //console.log('hasRequiredRole:', hasRequiredRole);
    if (!hasRequiredRole) {
      return <Navigate to="/" />;
    }
  }

  return <Outlet />;
};



export default ProtectedRoute;
