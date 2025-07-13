import { apiClient } from './apiClient';

// Types for Profile API
export interface ProfileUpdateDTO {
  firstName?: string;
  lastName?: string;
  email?: string;
  phoneNumber?: string;
}

export interface ProfileResponse {
  message: string;
  success?: boolean;
  timestamp?: number;
}

export interface UserProfileData {
  id: number;
  firstName: string;
  lastName: string;
  middleName?: string;
  email: string;
  username: string;
  phoneNumber?: string;
  address?: string;
  status: string;
  kycStatus: string;
  accountLevel: string;
  emailVerified: boolean;
  hasAvatar: boolean;
  avatarUrl?: string;
  registeredDate: string;
  lastLoginDate: string;
}

export interface MyProfileResponse {
  data: UserProfileData;
  success: boolean;
  count: number;
  timestamp: number;
}

export interface AvatarResponse {
  success: boolean;
  message: string;
  avatarUrl?: string;
  imageName?: string; // The filename/path returned by the backend
  timestamp: number;
}

export interface ApiError {
  success: false;
  error: string;
  timestamp: number;
}

/**
 * Profile Management API Service
 * Provides methods for managing user profiles
 */
export class ProfileAPI {
  private static baseUrl = '/api/user/profile';

  /**
   * Get current user's full profile (beyond JWT data)
   */
  static async getProfile(): Promise<MyProfileResponse> {
    const response = await apiClient.get<MyProfileResponse>(`${this.baseUrl}/myprofile`);
    return response.data;
  }

  /**
   * Update user profile
   */
  static async updateProfile(profileData: ProfileUpdateDTO): Promise<ProfileResponse> {
    const response = await apiClient.put<ProfileResponse>(`${this.baseUrl}/update`, profileData);
    return response.data;
  }

  /**
   * Upload profile picture
   */
  static async uploadProfilePicture(file: File): Promise<AvatarResponse> {
    const formData = new FormData();
    formData.append('avatar', file);

    const response = await apiClient.post<AvatarResponse>(`${this.baseUrl}/avatar`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data;
  }

  /**
   * Get current user's profile picture
   */
  static async getProfilePicture(): Promise<AvatarResponse> {
    const response = await apiClient.get<AvatarResponse>(`${this.baseUrl}/avatar`);
    return response.data;
  }

  /**
   * Get profile picture URL for display
   * @param imageName The image filename returned from the upload/get endpoints
   */
  static getProfilePictureUrl(imageName: string): string {
    const baseUrl = apiClient.defaults.baseURL || '';
    return `${baseUrl}/api/user/profile/avatar/image/${imageName}`;
  }

  /**
   * Delete current user's profile picture
   */
  static async deleteProfilePicture(): Promise<ProfileResponse> {
    const response = await apiClient.delete<ProfileResponse>(`${this.baseUrl}/avatar`);
    return response.data;
  }
}

/**
 * Utility functions for Profile Management
 */
export const ProfileUtils = {
  /**
   * Validate file type for profile picture
   */
  validateImageFile(file: File): { isValid: boolean; error?: string } {
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
    const maxSize = 5 * 1024 * 1024; // 5MB

    if (!allowedTypes.includes(file.type)) {
      return {
        isValid: false,
        error: 'Only JPG, JPEG, and PNG files are allowed'
      };
    }

    if (file.size > maxSize) {
      return {
        isValid: false,
        error: 'File size must be less than 5MB'
      };
    }

    return { isValid: true };
  },

  /**
   * Format file size for display
   */
  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  },

  /**
   * Validate profile data
   */
  validateProfileData(data: ProfileUpdateDTO): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (data.firstName && data.firstName.trim().length < 2) {
      errors.push('First name must be at least 2 characters long');
    }

    if (data.lastName && data.lastName.trim().length < 2) {
      errors.push('Last name must be at least 2 characters long');
    }

    if (data.email && !this.isValidEmail(data.email)) {
      errors.push('Please enter a valid email address');
    }

    if (data.phoneNumber && !this.isValidPhoneNumber(data.phoneNumber)) {
      errors.push('Please enter a valid phone number');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  },

  /**
   * Check if email is valid
   */
  isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  },

  /**
   * Check if phone number is valid (basic validation)
   */
  isValidPhoneNumber(phone: string): boolean {
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    return phoneRegex.test(phone.replace(/[\s\-\(\)]/g, ''));
  },

  /**
   * Get full avatar URL from response
   */
  getAvatarUrl(response: AvatarResponse): string | null {
    if (response.avatarUrl) {
      return this.getFullAvatarUrl(response.avatarUrl);
    }
    
    if (response.imageName) {
      return ProfileAPI.getProfilePictureUrl(response.imageName);
    }
    
    return null;
  },

  /**
   * Get full avatar URL from profile data
   */
  getFullAvatarUrl(avatarUrl: string): string {
    // If it's already a full URL, return as is
    if (avatarUrl.startsWith('http://') || avatarUrl.startsWith('https://')) {
      return avatarUrl;
    }
    
    // If it's a relative path, construct the full URL
    const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/bank';
    return `${baseUrl}${avatarUrl}`;
  },

  /**
   * Extract image name from avatar URL
   */
  extractImageName(avatarUrl: string): string | null {
    const matches = avatarUrl.match(/\/api\/user\/profile\/avatar\/image\/(.+)$/);
    return matches ? matches[1] : null;
  }
};
