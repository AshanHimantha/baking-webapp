import { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: 'CUSTOMER' | 'EMPLOYEE' | 'ADMIN';
  redirectTo?: string;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requiredRole,
  redirectTo = '/signin'
}) => {
  const { isAuthenticated, getUserRole, hasRole, getUser } = useAuthStore();
  const location = useLocation();

  // Check if user is authenticated
  if (!isAuthenticated()) {
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }

  // Check if user has required role
  if (requiredRole) {
    const userRole = getUserRole();
    
    // If user doesn't have the required role, check for redirects
    if (!hasRole(requiredRole)) {
      // If user role is NONE, redirect to KYC
      if (userRole === 'NONE') {
        return <Navigate to="/kyc" replace />;
      }
      // Otherwise, redirect to appropriate dashboard based on their primary role
      const dashboardPath = userRole === 'CUSTOMER' ? '/customer/dashboard' : '/admin/dashboard';
      return <Navigate to={dashboardPath} replace />;
    }
  }

  return <>{children}</>;
};

export default ProtectedRoute;
