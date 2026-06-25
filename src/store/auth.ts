import { create } from 'zustand';
import type { User, AuthResponse, LoginPayload, RegisterPayload } from '../types';
import { api } from '../api/client';

interface AuthState {
  user: User | null;
  roles: string[];
  activeRole: string | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;

  login: (payload: LoginPayload) => Promise<void>;
  register: (payload: RegisterPayload) => Promise<void>;
  logout: () => void;
  selectRole: (role: string) => Promise<void>;
  addRole: (role: string) => Promise<void>;
  fetchProfile: () => Promise<void>;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  roles: [],
  activeRole: localStorage.getItem('activeRole'),
  accessToken: localStorage.getItem('accessToken'),
  isAuthenticated: !!localStorage.getItem('accessToken'),
  isLoading: false,
  error: null,

  login: async (payload) => {
    set({ isLoading: true, error: null });
    try {
      const data = await api.post<AuthResponse>('/auth/login', payload);
      localStorage.setItem('accessToken', data.accessToken);
      if (data.activeRole) {
        localStorage.setItem('activeRole', data.activeRole);
      }
      set({
        user: data.user,
        roles: data.roles,
        activeRole: data.activeRole,
        accessToken: data.accessToken,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (e: any) {
      set({ isLoading: false, error: e.message || 'Login failed' });
      throw e;
    }
  },

  register: async (payload) => {
    set({ isLoading: true, error: null });
    try {
      const data = await api.post<AuthResponse>('/auth/register', payload);
      localStorage.setItem('accessToken', data.accessToken);
      if (data.activeRole) {
        localStorage.setItem('activeRole', data.activeRole);
      }
      set({
        user: data.user,
        roles: data.roles,
        activeRole: data.activeRole,
        accessToken: data.accessToken,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (e: any) {
      set({ isLoading: false, error: e.message || 'Registration failed' });
      throw e;
    }
  },

  logout: () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('activeRole');
    api.post('/auth/logout').catch(() => {});
    set({
      user: null,
      roles: [],
      activeRole: null,
      accessToken: null,
      isAuthenticated: false,
      error: null,
    });
  },

  addRole: async (role) => {
    set({ isLoading: true, error: null });
    try {
      const data = await api.post<AuthResponse>('/auth/roles', { role });
      localStorage.setItem('accessToken', data.accessToken);
      if (data.activeRole) {
        localStorage.setItem('activeRole', data.activeRole);
      } else {
        localStorage.removeItem('activeRole');
      }
      set({
        user: data.user,
        roles: data.roles,
        activeRole: data.activeRole,
        accessToken: data.accessToken,
        isLoading: false,
      });
    } catch (e: any) {
      set({ isLoading: false, error: e.message || 'Failed to add role' });
      throw e;
    }
  },

  selectRole: async (role) => {
    set({ isLoading: true, error: null });
    try {
      const data = await api.post<AuthResponse>('/auth/select-role', { role });
      localStorage.setItem('accessToken', data.accessToken);
      localStorage.setItem('activeRole', data.activeRole || '');
      set({
        activeRole: data.activeRole,
        accessToken: data.accessToken,
        roles: data.roles,
        isLoading: false,
      });
    } catch (e: any) {
      set({ isLoading: false, error: e.message || 'Role selection failed' });
      throw e;
    }
  },

  fetchProfile: async () => {
    try {
      const data = await api.get<AuthResponse>('/auth/me');
      set({
        user: data.user,
        roles: data.roles,
        activeRole: data.activeRole,
      });
    } catch {
      get().logout();
    }
  },

  clearError: () => set({ error: null }),
}));
