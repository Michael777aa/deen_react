import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User } from '@/types';

type AuthState = {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  loginWithApple: () => Promise<void>;
  logout: () => void;
  signup: (email: string, password: string, name: string) => Promise<void>;
  updateUserPreferences: (preferences: Partial<User['preferences']>) => void;
  updateLanguage: (language: string) => void;
};

// Mock user for demo purposes
const mockUser: User = {
  id: '1',
  email: 'user@example.com',
  name: 'Demo User',
  role: 'user',
  language: 'en',
  createdAt: new Date().toISOString(),
  lastActive: new Date().toISOString(),
  preferences: {
    darkMode: false,
    notifications: true,
    prayerReminders: true,
    dailyQuote: true,
  },
  subscription: 'free',
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
      login: async (email, password) => {
        set({ isLoading: true, error: null });
        try {
          // Simulate API call
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          // In a real app, this would be an API call to your backend
          if (email === 'user@example.com' && password === 'password') {
            set({ user: mockUser, isAuthenticated: true, isLoading: false });
          } else {
            set({ error: 'Invalid credentials', isLoading: false });
          }
        } catch (error) {
          set({ error: 'Login failed', isLoading: false });
        }
      },
      loginWithGoogle: async () => {
        set({ isLoading: true, error: null });
        try {
          // Simulate API call
          await new Promise(resolve => setTimeout(resolve, 1000));
          set({ user: mockUser, isAuthenticated: true, isLoading: false });
        } catch (error) {
          set({ error: 'Google login failed', isLoading: false });
        }
      },
      loginWithApple: async () => {
        set({ isLoading: true, error: null });
        try {
          // Simulate API call
          await new Promise(resolve => setTimeout(resolve, 1000));
          set({ user: mockUser, isAuthenticated: true, isLoading: false });
        } catch (error) {
          set({ error: 'Apple login failed', isLoading: false });
        }
      },
      logout: () => {
        set({ user: null, isAuthenticated: false });
      },
      signup: async (email, password, name) => {
        set({ isLoading: true, error: null });
        try {
          // Simulate API call
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          const newUser: User = {
            ...mockUser,
            email,
            name,
          };
          
          set({ user: newUser, isAuthenticated: true, isLoading: false });
        } catch (error) {
          set({ error: 'Signup failed', isLoading: false });
        }
      },
      updateUserPreferences: (preferences) => {
        set((state) => ({
          user: state.user ? {
            ...state.user,
            preferences: {
              ...state.user.preferences,
              ...preferences,
            }
          } : null
        }));
      },
      updateLanguage: (language) => {
        set((state) => ({
          user: state.user ? {
            ...state.user,
            language,
          } : null
        }));
      },
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);