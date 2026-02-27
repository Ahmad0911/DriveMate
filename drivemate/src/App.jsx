// App.js or your routing component
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import DriveMatePro from './components/DriveMatePro';
import AdminDashboard from './components/AdminDashboard';
import AdminLogin from './components/AdminLogin';

function App() {
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);

  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<DriveMatePro />} />
        <Route path="/admin/login" element={<AdminLogin onLogin={() => setIsAdminAuthenticated(true)} />} />
        
        {/* Protected Admin Routes */}
        <Route 
          path="/admin/dashboard" 
          element={
            isAdminAuthenticated ? 
            <AdminDashboard /> : 
            <Navigate to="/admin/login" />
          } 
        />
        <Route path="/admin/*" element={<Navigate to="/admin/login" />} />
        
        {/* 404 Route */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}