export interface User {
  id: string;
  email: string;
  username: string;
  createdAt: string;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  prompt: string;
  aiModel: string;
  status: 'pending' | 'generating' | 'completed' | 'failed';
  files: ProjectFile[];
  metadata: ProjectMetadata;
  error?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ProjectFile {
  path: string;
  content: string;
  type: 'file' | 'directory';
  size: number;
}

export interface ProjectMetadata {
  framework: string;
  backend: string;
  database: string;
  features: string[];
  estimatedTime: string;
  complexity: 'simple' | 'medium' | 'complex';
}

export interface AIModel {
  id: string;
  name: string;
  provider: string;
  type: 'api' | 'local';
  baseUrl?: string;
  apiKey?: string;
  isAvailable: boolean;
  maxTokens: number;
  costPerToken: number;
}

export interface GenerationRequest {
  prompt: string;
  aiModel: string;
  framework?: string;
  backend?: string;
  database?: string;
  features?: string[];
}

export interface GenerationResponse {
  success: boolean;
  projectId?: string;
  files?: ProjectFile[];
  error?: string;
  estimatedTime?: string;
}

export interface AuthRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  success: boolean;
  token?: string;
  user?: User;
  error?: string;
}

export interface APIResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface PaginationParams {
  page: number;
  limit: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface LoginFormData {
  email: string;
  password: string;
}

export interface RegisterFormData {
  email: string;
  username: string;
  password: string;
  confirmPassword: string;
}

export interface ProjectFormData {
  prompt: string;
  aiModel: string;
  framework?: string;
  backend?: string;
  database?: string;
  features?: string[];
}

export interface FileTree {
  name: string;
  type: 'file' | 'directory';
  path: string;
  children?: FileTree[];
  content?: string;
  size?: number;
}

export interface Theme {
  mode: 'light' | 'dark';
}

export interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (data: LoginFormData) => Promise<void>;
  register: (data: RegisterFormData) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

export interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}