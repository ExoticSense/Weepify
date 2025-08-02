/**
 * 🛡️ Protected Route Component
 * 
 * This component protects routes from unauthorized access.
 * Redirects to login if user is not authenticated.
 */

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiUtils } from '../services/api';

const ProtectedRoute = ({ children }) => {
  const navigate = useNavigate();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    // Small delay to allow auth state to settle
    const checkAuth = () => {
      if (!apiUtils.isAuthenticated()) {
        // User is not logged in, redirect to login
        navigate('/login');
      } else {
        setIsChecking(false);
      }
    };

    // Add a small delay to prevent redirect loops
    const timer = setTimeout(checkAuth, 100);
    
    return () => clearTimeout(timer);
  }, [navigate]);

  // Show loading while checking auth
  if (isChecking) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white flex items-center justify-center">
        <div className="text-2xl text-blue-400">Checking authentication... 💧</div>
      </div>
    );
  }

  // If user is authenticated, show the protected content
  if (apiUtils.isAuthenticated()) {
    return children;
  }

  // This shouldn't be reached, but just in case
  return null;
};

export default ProtectedRoute;
