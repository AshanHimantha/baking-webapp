import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';

interface KYCOnlyRouteProps {
  children: React.ReactNode;
}

export const KYCOnlyRoute: React.FC<KYCOnlyRouteProps> = ({ children }) => {
  const { isAuthenticated, getUserRole, getUser } = useAuthStore();
  const location = useLocation();

  // Check if user is authenticated
  if (!isAuthenticated()) {
    return <Navigate to="/signin" state={{ from: location }} replace />;
  }

  // Check if user has NONE role (needs KYC)
  const userRole = getUserRole();
  if (userRole !== 'NONE') {
    // If user already has a role, redirect to appropriate dashboard
    const dashboardPath = userRole === 'CUSTOMER' ? '/customer/dashboard' : 
                         userRole === 'ADMIN' ? '/admin/dashboard' :
                         userRole === 'EMPLOYEE' ? '/admin/dashboard' : '/';
    return <Navigate to={dashboardPath} replace />;
  }

  return <>{children}</>;
};

export default KYCOnlyRoute;
