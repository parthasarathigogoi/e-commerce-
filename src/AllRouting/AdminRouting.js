import React from 'react';
import { Routes, Route } from 'react-router-dom';
import AdminAuth from '../pages/admin/AdminAuth';
import AdminDashboard from '../pages/admin/AdminDashboard';
import { useAdmin } from '../context/AdminContext';
import { Navigate } from 'react-router-dom';

// Protected Route Component for Admin
const AdminProtectedRoute = ({ children }) => {
  const { isAdminAuthenticated } = useAdmin();
  
  // Redirect to admin auth if not authenticated as admin
  if (!isAdminAuthenticated) {
    return <Navigate to="/admin/auth" replace />;
  }
  
  return children;
};

const AdminRouting = () => {
  return (
    <Routes>
      <Route path="/admin/auth" element={<AdminAuth />} />
      <Route path="/admin/dashboard" element={
        <AdminProtectedRoute>
          <AdminDashboard />
        </AdminProtectedRoute>
      } />
    </Routes>
  );
};

export default AdminRouting; 