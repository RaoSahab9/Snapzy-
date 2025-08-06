import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { APIResponse, AuthRequest, AuthResponse, GenerationRequest, Project, AIModel } from '@/types';

class ApiService {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Request interceptor to add auth token
    this.api.interceptors.request.use(
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
    this.api.interceptors.response.use(
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
  }

  // Auth endpoints
  async login(data: AuthRequest): Promise<AuthResponse> {
    const response: AxiosResponse<APIResponse<AuthResponse>> = await this.api.post('/auth/login', data);
    return response.data.data!;
  }

  async register(data: AuthRequest & { username: string }): Promise<AuthResponse> {
    const response: AxiosResponse<APIResponse<AuthResponse>> = await this.api.post('/auth/register', data);
    return response.data.data!;
  }

  async getProfile(): Promise<any> {
    const response: AxiosResponse<APIResponse<any>> = await this.api.get('/auth/profile');
    return response.data.data;
  }

  // Project endpoints
  async generateProject(data: GenerationRequest): Promise<{ projectId: string; status: string }> {
    const response: AxiosResponse<APIResponse<{ projectId: string; status: string }>> = await this.api.post('/projects/generate', data);
    return response.data.data!;
  }

  async getProjects(page = 1, limit = 10): Promise<{ projects: Project[]; pagination: any }> {
    const response: AxiosResponse<APIResponse<{ projects: Project[]; pagination: any }>> = await this.api.get(`/projects?page=${page}&limit=${limit}`);
    return response.data.data!;
  }

  async getProject(id: string): Promise<Project> {
    const response: AxiosResponse<APIResponse<Project>> = await this.api.get(`/projects/${id}`);
    return response.data.data!;
  }

  async downloadProject(id: string): Promise<Blob> {
    const response = await this.api.get(`/projects/${id}/download`, {
      responseType: 'blob',
    });
    return response.data;
  }

  async deleteProject(id: string): Promise<void> {
    await this.api.delete(`/projects/${id}`);
  }

  // Model endpoints
  async getAvailableModels(): Promise<AIModel[]> {
    const response: AxiosResponse<APIResponse<AIModel[]>> = await this.api.get('/models');
    return response.data.data!;
  }

  async testModelConnection(modelId: string): Promise<{ modelId: string; isConnected: boolean; message: string }> {
    const response: AxiosResponse<APIResponse<{ modelId: string; isConnected: boolean; message: string }>> = await this.api.post(`/models/${modelId}/test`);
    return response.data.data!;
  }

  async getModelInfo(modelId: string): Promise<AIModel> {
    const response: AxiosResponse<APIResponse<AIModel>> = await this.api.get(`/models/${modelId}`);
    return response.data.data!;
  }

  // Health check
  async healthCheck(): Promise<{ message: string; timestamp: string; version: string }> {
    const response: AxiosResponse<APIResponse<{ message: string; timestamp: string; version: string }>> = await this.api.get('/health');
    return response.data.data!;
  }
}

export const apiService = new ApiService();
export default apiService;