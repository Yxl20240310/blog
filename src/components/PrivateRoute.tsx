import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useBlogStore } from '../store/useBlogStore';

export const PrivateRoute = () => {
  const { isAdmin } = useBlogStore();
  const location = useLocation();

  if (!isAdmin) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <Outlet />;
};

export const AuthRoute = () => {
  const { currentUser } = useBlogStore();
  const location = useLocation();

  if (!currentUser) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <Outlet />;
};