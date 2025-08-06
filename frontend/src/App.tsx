import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import Layout from '@/components/Layout';
import HomePage from '@/pages/HomePage';
import LoginPage from '@/pages/LoginPage';
import RegisterPage from '@/pages/RegisterPage';
import DashboardPage from '@/pages/DashboardPage';
import GeneratePage from '@/pages/GeneratePage';
import ProjectPage from '@/pages/ProjectPage';
import LoadingSpinner from '@/components/LoadingSpinner';

const App: React.FC = () => {
  const { user, isLoading } = useAuth();
  const { theme } = useTheme();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${theme.mode === 'dark' ? 'dark' : ''}`}>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={user ? <Navigate to="/dashboard" /> : <LoginPage />} />
        <Route path="/register" element={user ? <Navigate to="/dashboard" /> : <RegisterPage />} />
        
        {/* Protected routes */}
        <Route path="/dashboard" element={user ? <Layout><DashboardPage /></Layout> : <Navigate to="/login" />} />
        <Route path="/generate" element={user ? <Layout><GeneratePage /></Layout> : <Navigate to="/login" />} />
        <Route path="/project/:id" element={user ? <Layout><ProjectPage /></Layout> : <Navigate to="/login" />} />
        
        {/* Catch all route */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </div>
  );
};

export default App;