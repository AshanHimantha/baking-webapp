import { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';

type Role = 'CUSTOMER' | 'EMPLOYEE' | 'ADMIN';
interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: Role | Role[];
  redirectTo?: string;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requiredRole,
  redirectTo = '/signin'
}) => {
  const { isAuthenticated, getUserRole } = useAuthStore();
  const location = useLocation();

  // Check if user is authenticated
  if (!isAuthenticated()) {
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }

  // Check if user has required role (support string or array)
  if (requiredRole) {
    const userRole = getUserRole();
    const requiredRoles = Array.isArray(requiredRole) ? requiredRole : [requiredRole];
    if (!requiredRoles.includes(userRole)) {
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
