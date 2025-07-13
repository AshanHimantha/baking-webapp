import { useEffect, useState, useCallback } from 'react';
import { useAuthStore, type UserRole } from '@/store/authStore';

export interface UserProfile {
  sub: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  kycStatus?: string;
  roles: UserRole[];
  iat: number;
  exp: number;
}

/**
 * Hook to get user data from JWT token
 */
export const useUserProfile = () => {
  const authStore = useAuthStore();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const updateUser = useCallback(() => {
    try {
      if (authStore.isAuthenticated()) {
        const userData = authStore.getUser();
        setUser(userData);
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error('Error getting user data:', error);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, [authStore]);

  useEffect(() => {
    updateUser();
  }, [updateUser]);

  const getDisplayName = useCallback(() => {
    if (!user) return 'Unknown User';
    return `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.email || user.sub;
  }, [user]);

  const getInitials = useCallback(() => {
    if (!user) return 'U';
    const firstName = user.firstName || '';
    const lastName = user.lastName || '';
    return `${firstName[0] || ''}${lastName[0] || ''}`.toUpperCase() || user.email?.[0]?.toUpperCase() || 'U';
  }, [user]);

  const getRoleName = useCallback(() => {
    if (!user || !user.roles || user.roles.length === 0) return 'User';
    const role = user.roles[0];
    switch (role) {
      case 'ADMIN':
        return 'Administrator';
      case 'EMPLOYEE':
        return 'Employee';
      case 'CUSTOMER':
        return 'Customer';
      default:
        return 'User';
    }
  }, [user]);

  const hasRole = useCallback((role: UserRole) => {
    return user?.roles?.includes(role) || false;
  }, [user]);

  return {
    user,
    isLoading,
    isAuthenticated: authStore.isAuthenticated(),
    getDisplayName,
    getInitials,
    getRoleName,
    hasRole
  };
};

export default useUserProfile;
