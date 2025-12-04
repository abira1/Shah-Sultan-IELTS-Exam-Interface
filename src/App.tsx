import React, { useEffect, useState } from 'react';
import { HomePage } from './pages/HomePage';
import { AdminDashboard } from './pages/AdminDashboard';
import { AdminLogin } from './components/AdminLogin';

export function App() {
  const [isAdminRoute, setIsAdminRoute] = useState(false);
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);

  useEffect(() => {
    // Check if URL is /admin
    const isAdmin = window.location.pathname === '/admin';
    setIsAdminRoute(isAdmin);
    
    // Check if admin password was saved in sessionStorage
    if (isAdmin && sessionStorage.getItem('adminAuth') === 'true') {
      setIsAdminAuthenticated(true);
    }
  }, []);

  const handleAdminAuth = () => {
    sessionStorage.setItem('adminAuth', 'true');
    setIsAdminAuthenticated(true);
  };

  // If on admin route but not authenticated, show login
  if (isAdminRoute && !isAdminAuthenticated) {
    return <AdminLogin onAuthSuccess={handleAdminAuth} />;
  }

  // If on admin route and authenticated, show dashboard
  if (isAdminRoute && isAdminAuthenticated) {
    return <AdminDashboard />;
  }

  // Otherwise show home page
  return <HomePage />;
}