import axios from 'axios';
import { AuthResponse, ApiResponse, RegisterFormData, CreatePostData, UpdateProfileData } from '../types';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API functions
export const authAPI = {
  login: async (email: string, password: string): Promise<AuthResponse> => {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
  },

  register: async (data: RegisterFormData): Promise<AuthResponse> => {
    const response = await api.post('/auth/register', data);
    return response.data;
  },

  getMe: async (): Promise<ApiResponse> => {
    const response = await api.get('/auth/me');
    return response.data;
  },
};

// User API functions
export const userAPI = {
  getUserProfile: async (userId: string): Promise<ApiResponse> => {
    const response = await api.get(`/users/${userId}`);
    return response.data;
  },

  updateProfile: async (data: UpdateProfileData): Promise<ApiResponse> => {
    const response = await api.put('/users/profile', data);
    return response.data;
  },

  toggleFollow: async (userId: string): Promise<ApiResponse> => {
    const response = await api.post(`/users/${userId}/follow`);
    return response.data;
  },

  getFollowers: async (userId: string): Promise<ApiResponse> => {
    const response = await api.get(`/users/${userId}/followers`);
    return response.data;
  },

  getFollowing: async (userId: string): Promise<ApiResponse> => {
    const response = await api.get(`/users/${userId}/following`);
    return response.data;
  },

  searchUsers: async (query: string): Promise<ApiResponse> => {
    const response = await api.get(`/users/search?q=${encodeURIComponent(query)}`);
    return response.data;
  },
};

// Post API functions
export const postAPI = {
  createPost: async (data: CreatePostData): Promise<ApiResponse> => {
    const formData = new FormData();
    formData.append('image', data.image);
    if (data.caption) formData.append('caption', data.caption);
    if (data.location) formData.append('location', data.location);

    const response = await api.post('/posts', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  getFeed: async (page = 1, limit = 10): Promise<ApiResponse> => {
    const response = await api.get(`/posts/feed?page=${page}&limit=${limit}`);
    return response.data;
  },

  getPost: async (postId: string): Promise<ApiResponse> => {
    const response = await api.get(`/posts/${postId}`);
    return response.data;
  },

  getUserPosts: async (userId: string, page = 1, limit = 12): Promise<ApiResponse> => {
    const response = await api.get(`/posts/user/${userId}?page=${page}&limit=${limit}`);
    return response.data;
  },

  deletePost: async (postId: string): Promise<ApiResponse> => {
    const response = await api.delete(`/posts/${postId}`);
    return response.data;
  },

  toggleLike: async (postId: string): Promise<ApiResponse> => {
    const response = await api.post(`/posts/${postId}/like`);
    return response.data;
  },

  addComment: async (postId: string, text: string): Promise<ApiResponse> => {
    const response = await api.post(`/posts/${postId}/comments`, { text });
    return response.data;
  },

  deleteComment: async (postId: string, commentId: string): Promise<ApiResponse> => {
    const response = await api.delete(`/posts/${postId}/comments/${commentId}`);
    return response.data;
  },

  getExplorePosts: async (page = 1, limit = 12): Promise<ApiResponse> => {
    const response = await api.get(`/posts/explore?page=${page}&limit=${limit}`);
    return response.data;
  },
};

export default api;