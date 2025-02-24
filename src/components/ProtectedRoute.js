import React from 'react';
import { useRouter } from 'next/router';

const ProtectedRoute = ({ children }) => {
  const router = useRouter();
  const isAuthenticated = typeof window !== 'undefined' && localStorage.getItem('token');

  if (!isAuthenticated) {
    router.push('/auth/login');
    return null;
  }

  return children;
};

export default ProtectedRoute;

