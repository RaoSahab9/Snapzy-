import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000, // 30 seconds
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
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

// Response interceptor
api.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    const message = error.response?.data?.error || error.message || 'An error occurred';
    return Promise.reject(new Error(message));
  }
);

// API methods
export const apiService = {
  // Health check
  health: () => api.get('/health'),

  // Models
  getModels: () => api.get('/models'),
  getModelStatus: () => api.get('/models/status'),

  // Templates
  getTemplates: () => api.get('/generate/templates'),

  // Project generation
  generateProject: (data) => api.post('/generate', data),
  getProjectStatus: (projectId) => api.get(`/generate/status/${projectId}`),
  getProjectFiles: (projectId) => api.get(`/generate/files/${projectId}`),

  // Download
  getDownloadInfo: (projectId) => api.get(`/download/${projectId}/info`),
  downloadProject: (projectId) => {
    return axios({
      method: 'GET',
      url: `${API_BASE_URL}/download/${projectId}`,
      responseType: 'blob',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token') || ''}`,
      },
    });
  },

  // Auth (optional)
  register: (userData) => api.post('/auth/register', userData),
  login: (credentials) => api.post('/auth/login', credentials),
  getProfile: () => api.get('/auth/profile'),
  updateProfile: (data) => api.put('/auth/profile', data),
  getUserProjects: () => api.get('/auth/projects'),
};

export default apiService;