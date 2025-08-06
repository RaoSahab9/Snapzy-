export interface User {
  _id: string;
  email: string;
  username: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Project {
  _id: string;
  userId: string;
  title: string;
  description: string;
  prompt: string;
  aiModel: string;
  status: 'pending' | 'generating' | 'completed' | 'failed';
  files: ProjectFile[];
  metadata: ProjectMetadata;
  createdAt: Date;
  updatedAt: Date;
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
  user?: {
    id: string;
    email: string;
    username: string;
  };
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

// AI Model specific types
export interface OpenAIMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface ClaudeMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface GeminiMessage {
  role: 'user' | 'model';
  parts: { text: string }[];
}

// File system types
export interface FileTree {
  name: string;
  type: 'file' | 'directory';
  path: string;
  children?: FileTree[];
  content?: string;
  size?: number;
}

// Validation types
export interface ValidationError {
  field: string;
  message: string;
}

// Rate limiting types
export interface RateLimitInfo {
  limit: number;
  remaining: number;
  reset: Date;
}