import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';

/**
 * Protected Route Component
 * Redirects to login if user is not authenticated
 * Optionally checks for admin access
 */
const ProtectedRoute = ({ children, requireAdmin = false }) => {
  const { loggedInUser, isLoading } = useAppContext();

  // Show loading spinner while checking auth
  if (isLoading) {
    return (
      <div className="loading-screen">
        <div className="loading-spinner"></div>
        <p>Loading...</p>
      </div>
    );
  }

  // If no user is logged in, redirect to login
  if (!loggedInUser) {
    return <Navigate to="/login" replace />;
  }

  // If admin access is required but user is not admin, redirect to dashboard
  if (requireAdmin && !loggedInUser.isAdmin) {
    return <Navigate to="/dashboard" replace />;
  }

  // User is authenticated, render the children
  return children;
};

export default ProtectedRoute;
