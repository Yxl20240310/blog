import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useBlogStore } from '../store/useBlogStore';

export const PrivateRoute = () => {
  const { isAdmin } = useBlogStore();

  if (!isAdmin) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};