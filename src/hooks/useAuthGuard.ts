import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';

/**
 * Hook to check authentication status and redirect if needed
 * @param redirectTo - Path to redirect to if not authenticated
 * @returns Authentication state and user info
 */
export const useAuthGuard = (redirectTo: string = '/signin') => {
  const navigate = useNavigate();
  const { isAuthenticated, getUser, getUserRole } = useAuthStore();

  useEffect(() => {
    if (!isAuthenticated()) {
      navigate(redirectTo);
    }
  }, [navigate, redirectTo, isAuthenticated]);

  return {
    isAuthenticated: isAuthenticated(),
    user: getUser(),
    userRole: getUserRole(),
  };
};

/**
 * Hook to redirect authenticated users away from auth pages
 * @param redirectTo - Path to redirect to if authenticated (default: dashboard based on role)
 */
export const useRedirectIfAuthenticated = (redirectTo?: string) => {
  const navigate = useNavigate();
  const { isAuthenticated, getUserRole } = useAuthStore();

  useEffect(() => {
    if (isAuthenticated()) {
      if (redirectTo) {
        navigate(redirectTo);
      } else {
        // Default redirect based on user role
        const userRole = getUserRole();
        if (userRole === 'NONE') {
          navigate('/kyc');
        } else if (userRole === 'CUSTOMER') {
          navigate('/customer/dashboard');
        } else if (userRole === 'EMPLOYEE' || userRole === 'ADMIN') {
          navigate('/admin/dashboard');
        }
      }
    }
  }, [navigate, redirectTo, isAuthenticated, getUserRole]);
};

export default useAuthGuard;
