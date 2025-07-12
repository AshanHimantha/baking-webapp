import { create } from 'zustand';
import { jwtDecode } from 'jwt-decode';
import apiClient from '@/lib/apiClient';

export type UserRole = 'NONE' | 'CUSTOMER' | 'EMPLOYEE' | 'ADMIN';

interface User {
  sub: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  kycStatus?: string;
  roles: UserRole[];
  iat: number;
  exp: number;
}

interface AuthState {
  isLoading: boolean;
  login: (credentials: { username: string; password: string }) => Promise<void>;
  verifyLogin: (credentials: { username: string; code: string }) => Promise<void>;
  logout: () => void;
  setLoading: (loading: boolean) => void;
  getToken: () => string | null;
  getUser: () => User | null;
  getUserRole: () => UserRole | null;
  isAuthenticated: () => boolean;
  isTokenExpired: () => boolean;
}

const TOKEN_KEY = 'auth_token';
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

export const useAuthStore = create<AuthState>()((set, get) => ({
  isLoading: false,

  login: async (credentials) => {
    set({ isLoading: true });
    
    try {
      const response = await apiClient.post('/api/auth/login', credentials);
      
      console.log('Login successful:', response.data);
      // Login successful, but we need verification
      set({ isLoading: false });
    } catch (error) {
      console.error('Login failed:', error);
      set({ isLoading: false });
      throw error;
    }
  },

  verifyLogin: async (credentials) => {
    set({ isLoading: true });
    
    try {
      const response = await apiClient.post('/api/auth/verify-login', credentials);
      
      const { token } = response.data;
      
      // Store token in localStorage
      localStorage.setItem(TOKEN_KEY, token);
      
      // Set apiClient default authorization header
      apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      set({ isLoading: false });
      
      console.log('Login verification successful');
    } catch (error) {
      console.error('Login verification failed:', error);
      set({ isLoading: false });
      throw error;
    }
  },

  logout: () => {
    // Remove token from localStorage
    localStorage.removeItem(TOKEN_KEY);
    
    // Remove apiClient default authorization header
    delete apiClient.defaults.headers.common['Authorization'];
    
    set({ isLoading: false });
  },

  setLoading: (loading: boolean) => {
    set({ isLoading: loading });
  },

  getToken: () => {
    return localStorage.getItem(TOKEN_KEY);
  },

  getUser: () => {
    const token = get().getToken();
    if (!token) return null;
    
    try {
      const decoded = jwtDecode<User>(token);
      return decoded;
    } catch (error) {
      console.error('Error decoding token:', error);
      return null;
    }
  },

  getUserRole: () => {
    const user = get().getUser();
    if (!user || !user.roles || user.roles.length === 0) {
      return null;
    }
    return user.roles[0]; // Return the first role
  },

  isAuthenticated: () => {
    const token = get().getToken();
    return token !== null && !get().isTokenExpired();
  },

  isTokenExpired: () => {
    const token = get().getToken();
    if (!token) return true;
    
    try {
      const decoded = jwtDecode<User>(token);
      const currentTime = Date.now() / 1000;
      return decoded.exp < currentTime;
    } catch (error) {
      console.error('Error checking token expiration:', error);
      return true;
    }
  },
}));

// Initialize auth on app load
const initializeAuth = () => {
  const token = useAuthStore.getState().getToken();
  if (token && !useAuthStore.getState().isTokenExpired()) {
    apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else if (token) {
    // Token exists but is expired, remove it
    useAuthStore.getState().logout();
  }
};

// Call this on app initialization
initializeAuth();
