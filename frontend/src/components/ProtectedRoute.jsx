import React from 'react';
import { Navigate } from 'react-router-dom';
import useAuthStore from '../store/useAuthStore';
import Loader from './Loader';

const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { user, loading } = useAuthStore();

  if (loading) return <Loader />;

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (adminOnly && !user.isAdmin) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
