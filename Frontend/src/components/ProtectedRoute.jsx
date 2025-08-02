/**
 * 🛡️ Protected Route Component
 * 
 * This component protects routes from unauthorized access.
 * Redirects to login if user is not authenticated.
 */

import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiUtils } from '../services/api';

const ProtectedRoute = ({ children }) => {
  const navigate = useNavigate();

  useEffect(() => {
    if (!apiUtils.isAuthenticated()) {
      // User is not logged in, redirect to login
      navigate('/login');
    }
  }, [navigate]);

  // If user is authenticated, show the protected content
  if (apiUtils.isAuthenticated()) {
    return children;
  }

  // Show loading while checking auth (prevents flash)
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white flex items-center justify-center">
      <div className="text-2xl text-blue-400">Checking authentication... 💧</div>
    </div>
  );
};

export default ProtectedRoute;
