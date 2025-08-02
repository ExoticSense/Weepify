/**
 * 🔌 API Service - Frontend to Backend Connection
 * 
 * This file handles all communication with your Weepify backend API.
 * It includes authentication, cry log management, and error handling.
 */

import axios from 'axios';

// 🌐 Base URL for your backend API
const API_BASE_URL = 'http://localhost:3000/api';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 🔐 Add authentication token to requests automatically
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('weepify_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// 📤 Handle token expiration and logout on 401 errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid, logout user
      localStorage.removeItem('weepify_token');
      localStorage.removeItem('weepify_user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// 🔐 Authentication API calls
export const authAPI = {
  // Register new user
  register: async (userData) => {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },

  // Login user
  login: async (credentials) => {
    const response = await api.post('/auth/login', credentials);
    if (response.data.token) {
      localStorage.setItem('weepify_token', response.data.token);
      localStorage.setItem('weepify_user', JSON.stringify(response.data.user));
    }
    return response.data;
  },

  // Get user profile
  getProfile: async () => {
    const response = await api.get('/auth/profile');
    return response.data;
  },

  // Update user profile
  updateProfile: async (userData) => {
    const response = await api.put('/auth/profile', userData);
    return response.data;
  },

  // Change password
  changePassword: async (passwordData) => {
    const response = await api.put('/auth/change-password', passwordData);
    return response.data;
  },

  // Logout
  logout: async () => {
    try {
      await api.post('/auth/logout');
    } finally {
      localStorage.removeItem('weepify_token');
      localStorage.removeItem('weepify_user');
    }
  }
};

// 😭 Cry Logs API calls
export const cryLogsAPI = {
  // Get all crying sessions
  getAll: async () => {
    const response = await api.get('/crylogs');
    return response.data;
  },

  // Create new crying session
  create: async (cryLogData) => {
    const response = await api.post('/crylogs', cryLogData);
    return response.data;
  },

  // Get crying session by ID
  getById: async (id) => {
    const response = await api.get(`/crylogs/${id}`);
    return response.data;
  },

  // Update crying session
  update: async (id, cryLogData) => {
    const response = await api.put(`/crylogs/${id}`, cryLogData);
    return response.data;
  },

  // Delete crying session
  delete: async (id) => {
    const response = await api.delete(`/crylogs/${id}`);
    return response.data;
  },

  // Get crying sessions by date
  getByDate: async (date) => {
    const response = await api.get(`/crylogs/date/${date}`);
    return response.data;
  },

  // Get crying statistics and analytics
  getStats: async () => {
    const response = await api.get('/crylogs/stats');
    return response.data;
  }
};

// 🛠️ Utility functions
export const apiUtils = {
  // Check if user is authenticated
  isAuthenticated: () => {
    return !!localStorage.getItem('weepify_token');
  },

  // Get current user from localStorage
  getCurrentUser: () => {
    const user = localStorage.getItem('weepify_user');
    return user ? JSON.parse(user) : null;
  },

  // Clear all auth data
  clearAuth: () => {
    localStorage.removeItem('weepify_token');
    localStorage.removeItem('weepify_user');
  }
};

export default api;
