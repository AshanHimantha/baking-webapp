import { apiClient } from './apiClient';

// Types for the User Management API
export interface User {
  id: number;
  username: string;
  email: string;
  emailVerified: boolean;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  accountLevel: 'BRONZE' | 'GOLD' | 'PLATINUM' | 'DIAMOND';
  status: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED' | 'DEACTIVATED';
  kycStatus: 'PENDING' | 'VERIFIED' | 'REJECTED';
  profilePictureUrl?: string;
  registeredDate: string;
  lastLoginDate?: string | null;
}

export interface UserSearchResponse {
  users: User[];
  totalCount: number;
  page: number;
  limit: number;
  hasMore: boolean;
}

export interface SearchFilters {
  page?: number;
  limit?: number;
  accountLevel?: 'BRONZE' | 'GOLD' | 'PLATINUM' | 'DIAMOND';
  status?: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED' | 'DEACTIVATED';
  kycStatus?: 'PENDING' | 'VERIFIED' | 'REJECTED';
  username?: string;
  email?: string;
  searchTerm?: string;
}

export interface SuspendUserRequest {
  reason: string;
}

export interface ApiResponse {
  message: string;
}

export interface ApiError {
  error: string;
  message: string;
  timestamp: string;
}

/**
 * User Management API Service
 * Provides methods for managing user accounts in the enterprise banking platform
 */
export class UserManagementAPI {
  private static baseUrl = '/api/admin/manage/users';

  /**
   * List all users in the system
   */
  static async listAllUsers(): Promise<User[]> {
    const response = await apiClient.get<User[]>(this.baseUrl);
    return response.data;
  }

  /**
   * Get a specific user by username
   */
  static async getUserByUsername(username: string): Promise<User> {
    const response = await apiClient.get<User>(`${this.baseUrl}/${username}`);
    return response.data;
  }

  /**
   * Search for users with pagination and filtering
   */
  static async searchUsers(filters: SearchFilters = {}): Promise<UserSearchResponse> {
    // Clean up filters - remove undefined values
    const cleanFilters = Object.entries(filters).reduce((acc, [key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        acc[key] = value;
      }
      return acc;
    }, {} as any);

    const response = await apiClient.get<UserSearchResponse | User[]>(`${this.baseUrl}/search`, {
      params: cleanFilters
    });
    
    // Handle case where API returns array directly (for backwards compatibility)
    if (Array.isArray(response.data)) {
      return {
        users: response.data,
        totalCount: response.data.length,
        page: filters.page || 1,
        limit: filters.limit || 20,
        hasMore: false
      };
    }
    
    return response.data;
  }

  /**
   * Suspend a user account
   */
  static async suspendUser(username: string, reason: string): Promise<ApiResponse> {
    const response = await apiClient.post<ApiResponse>(`${this.baseUrl}/${username}/suspend`, {
      reason
    });
    return response.data;
  }

  /**
   * Reactivate a suspended user account
   */
  static async reactivateUser(username: string): Promise<ApiResponse> {
    const response = await apiClient.post<ApiResponse>(`${this.baseUrl}/${username}/reactivate`);
    return response.data;
  }

  /**
   * Export users data (if needed for the export functionality)
   */
  static async exportUsers(filters: SearchFilters = {}): Promise<Blob> {
    const response = await apiClient.get(`${this.baseUrl}/export`, {
      params: filters,
      responseType: 'blob'
    });
    return response.data;
  }
}

/**
 * Utility functions for User Management
 */
export const UserUtils = {
  /**
   * Get user's full name
   */
  getFullName(user: User): string {
    return `${user.firstName} ${user.lastName}`;
  },

  /**
   * Get user's initials for avatar
   */
  getInitials(user: User): string {
    return `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`;
  },

  /**
   * Get profile picture URL or return null if not available
   */
  getProfilePictureUrl(user: User): string | null {
    return user.profilePictureUrl || null;
  },

  /**
   * Check if user has profile picture
   */
  hasProfilePicture(user: User): boolean {
    return !!(user.profilePictureUrl && user.profilePictureUrl.trim() !== '');
  },

  /**
   * Get last login status
   */
  getLastLoginStatus(user: User): string {
    if (!user.lastLoginDate) {
      return 'Never logged in';
    }
    return `Last login: ${this.formatDateTime(user.lastLoginDate)}`;
  },

  /**
   * Check if user has ever logged in
   */
  hasLoggedIn(user: User): boolean {
    return !!(user.lastLoginDate);
  },

  /**
   * Get status color for UI
   */
  getStatusColor(status: User['status']): string {
    switch (status) {
      case 'ACTIVE': return 'bg-green-500';
      case 'INACTIVE': return 'bg-gray-500';
      case 'SUSPENDED': return 'bg-red-500';
      case 'DEACTIVATED': return 'bg-orange-500';
      default: return 'bg-gray-500';
    }
  },

  /**
   * Get account level color for UI
   */
  getAccountLevelColor(level: User['accountLevel']): string {
    switch (level) {
      case 'BRONZE': return 'bg-amber-600';
      case 'GOLD': return 'bg-yellow-500';
      case 'PLATINUM': return 'bg-gray-400';
      case 'DIAMOND': return 'bg-blue-600';
      default: return 'bg-gray-500';
    }
  },

  /**
   * Format date for display
   */
  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString();
  },

  /**
   * Format date and time for display
   */
  formatDateTime(dateString: string): string {
    return new Date(dateString).toLocaleString();
  },

  /**
   * Get registration date formatted
   */
  getRegistrationDate(user: User): string {
    return this.formatDate(user.registeredDate);
  },

  /**
   * Get time since registration
   */
  getTimeSinceRegistration(user: User): string {
    const registrationDate = new Date(user.registeredDate);
    const now = new Date();
    const diffInDays = Math.floor((now.getTime() - registrationDate.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffInDays === 0) {
      return 'Today';
    } else if (diffInDays === 1) {
      return 'Yesterday';
    } else if (diffInDays < 30) {
      return `${diffInDays} days ago`;
    } else if (diffInDays < 365) {
      const months = Math.floor(diffInDays / 30);
      return `${months} month${months > 1 ? 's' : ''} ago`;
    } else {
      const years = Math.floor(diffInDays / 365);
      return `${years} year${years > 1 ? 's' : ''} ago`;
    }
  }
};
