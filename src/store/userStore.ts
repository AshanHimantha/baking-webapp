// src/store/userStore.ts
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware'; // Optional: for persisting the store
import { jwtDecode } from 'jwt-decode'; // Correct import for ES modules
import apiClient from '@/lib/apiClient'; // Assuming this is your axios instance
import { toast } from 'sonner';

// Define the shape of your user profile data
export interface UserProfile {
  id: number;
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  emailVerified: boolean;
  phoneNumber: string;
  kycStatus: 'PENDING' | 'VERIFIED' | 'REJECTED' | 'NONE'; // Assuming 'NONE' is a possible status
  accountLevel: string;
  hasAvatar: boolean;
  avatarUrl: string | null;
  registeredDate: string;
  lastLoginDate: string;
  status: 'ACTIVE' | 'INACTIVE' | 'BLOCKED';
  address: string | null;
  middleName: string | null;
  // Add roles here, which you'll get from the JWT
  roles: string[];
}

// Define the shape of your store's state and actions
interface UserState {
  userProfile: UserProfile | null;
  isLoading: boolean;
  error: string | null;
  // Actions
  setProfile: (profile: UserProfile | null) => void;
  setIsLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  fetchUserProfile: () => Promise<void>;
  clearProfile: () => void;
}

export const useUserStore = create<UserState>()(
  // You can optionally persist this store to localStorage, but for profile data,
  // it's often better to refetch on app load to ensure freshness and security.
  // We'll skip `persist` for now to ensure data is always fresh from API.
  (set, get) => ({
    userProfile: null,
    isLoading: false,
    error: null,

    setProfile: (profile) => set({ userProfile: profile }),
    setIsLoading: (loading) => set({ isLoading: loading }),
    setError: (error) => set({ error: error }),

    fetchUserProfile: async () => {
      const token = localStorage.getItem('auth_token');

      if (!token) {
        console.log("No auth_token found. Skipping profile fetch.");
        get().clearProfile(); // Ensure profile is null if no token
        return;
      }

      try {
        // Decode the JWT token to check roles
        const decodedToken: { roles?: string[] } = jwtDecode(token);
        const userRoles = decodedToken.roles || [];

        // Check if roles include 'NONE' (or no meaningful roles)
        if (userRoles.length === 0 || userRoles.includes('NONE')) {
          console.log("User has 'NONE' role or no roles. Skipping profile fetch.");
          get().clearProfile(); // Clear profile if roles are 'NONE'
          toast.info("Your account status requires attention. Please check your profile."); // Optional: inform user
          return;
        }

        set({ isLoading: true, error: null });
        const response = await apiClient.get('/api/user/profile/myprofile');
       

        if (response.data.success && response.data.data) {
          const profileData: UserProfile = {
             
            ...response.data.data,
            roles: userRoles // Add roles from decoded token to the profile
          };
         
          set({ userProfile: profileData, error: null });
        } else {
          set({ error: response.data.message || "Failed to load user profile." });
          get().clearProfile(); // Clear profile on API failure
          toast.error("Failed to load user profile.");
        }
      } catch (err: any) {
        console.error("Error fetching user profile:", err);
        // Handle token expiration or invalid token more gracefully
        if (err.response?.status === 401 || err.response?.status === 403) {
            toast.error("Session expired or unauthorized. Please sign in again.");
            // Optionally, force logout here or trigger a logout action
            localStorage.removeItem('auth_token');
            get().clearProfile();
            // You might want to redirect to login here: window.location.href = '/signin';
        } else {
            set({ error: err.response?.data?.message || "An unexpected error occurred." });
            toast.error(err.response?.data?.message || "Failed to load user profile.");
        }
        get().clearProfile(); // Clear profile on any error
      } finally {
        set({ isLoading: false });
      }
    },

    clearProfile: () => {
      set({ userProfile: null, isLoading: false, error: null });
    },
  })
);