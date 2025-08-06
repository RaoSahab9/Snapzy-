import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation } from 'react-query';
import { useAuth } from '@/contexts/AuthContext';
import apiService from '@/services/api';
import { AIModel, GenerationRequest } from '@/types';
import toast from 'react-hot-toast';
import {
  SparklesIcon,
  CodeBracketIcon,
  ServerIcon,
  DatabaseIcon,
} from '@heroicons/react/24/outline';

const GeneratePage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [formData, setFormData] = useState<GenerationRequest>({
    prompt: '',
    aiModel: 'openai',
    framework: 'react',
    backend: 'nodejs',
    database: 'mongodb',
    features: [],
  });

  // Fetch available AI models
  const { data: models, isLoading: modelsLoading } = useQuery(
    'models',
    apiService.getAvailableModels,
    {
      staleTime: 5 * 60 * 1000, // 5 minutes
    }
  );

  // Generate project mutation
  const generateMutation = useMutation(
    (data: GenerationRequest) => apiService.generateProject(data),
    {
      onSuccess: (data) => {
        toast.success('Project generation started!');
        navigate(`/project/${data.projectId}`);
      },
      onError: (error: any) => {
        toast.error(error.response?.data?.error || 'Failed to generate project');
      },
    }
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.prompt.trim()) {
      toast.error('Please enter a description of your application');
      return;
    }
    generateMutation.mutate(formData);
  };

  const handlePromptChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, prompt: e.target.value }));
  };

  const handleModelChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFormData(prev => ({ ...prev, aiModel: e.target.value }));
  };

  const handleFrameworkChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFormData(prev => ({ ...prev, framework: e.target.value }));
  };

  const handleBackendChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFormData(prev => ({ ...prev, backend: e.target.value }));
  };

  const handleDatabaseChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFormData(prev => ({ ...prev, database: e.target.value }));
  };

  const toggleFeature = (feature: string) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features?.includes(feature)
        ? prev.features.filter(f => f !== feature)
        : [...(prev.features || []), feature],
    }));
  };

  const examplePrompts = [
    'Create a blog application with user authentication, post creation, commenting system, and admin dashboard',
    'Build an e-commerce platform with product catalog, shopping cart, user authentication, payment integration, and order management',
    'Develop a task management application with user registration, project creation, task assignment, progress tracking, and real-time notifications',
    'Generate a social media platform with user profiles, posts, likes, comments, follow system, and real-time messaging',
  ];

  const frameworks = [
    { value: 'react', label: 'React', icon: CodeBracketIcon },
    { value: 'vue', label: 'Vue.js', icon: CodeBracketIcon },
    { value: 'angular', label: 'Angular', icon: CodeBracketIcon },
    { value: 'svelte', label: 'Svelte', icon: CodeBracketIcon },
    { value: 'nextjs', label: 'Next.js', icon: CodeBracketIcon },
    { value: 'nuxtjs', label: 'Nuxt.js', icon: CodeBracketIcon },
  ];

  const backends = [
    { value: 'nodejs', label: 'Node.js', icon: ServerIcon },
    { value: 'python', label: 'Python', icon: ServerIcon },
    { value: 'go', label: 'Go', icon: ServerIcon },
    { value: 'rust', label: 'Rust', icon: ServerIcon },
    { value: 'java', label: 'Java', icon: ServerIcon },
    { value: 'csharp', label: 'C#', icon: ServerIcon },
  ];

  const databases = [
    { value: 'mongodb', label: 'MongoDB', icon: DatabaseIcon },
    { value: 'postgresql', label: 'PostgreSQL', icon: DatabaseIcon },
    { value: 'mysql', label: 'MySQL', icon: DatabaseIcon },
    { value: 'sqlite', label: 'SQLite', icon: DatabaseIcon },
  ];

  const features = [
    'authentication',
    'authorization',
    'file-upload',
    'real-time',
    'search',
    'pagination',
    'email',
    'notifications',
    'analytics',
    'payment',
  ];

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Generate Your Application
        </h1>
        <p className="mt-2 text-gray-600 dark:text-gray-300">
          Describe your application in plain English and let AI create the complete codebase
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Prompt Input */}
        <div className="card">
          <div className="card-header">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Application Description
            </h2>
          </div>
          <div className="card-body">
            <textarea
              value={formData.prompt}
              onChange={handlePromptChange}
              placeholder="Describe your application in detail. For example: Create a blog application with user authentication, post creation, commenting system, and admin dashboard..."
              className="input-field h-32 resize-none"
              required
            />
            
            {/* Example Prompts */}
            <div className="mt-4">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                Try these example prompts:
              </p>
              <div className="grid grid-cols-1 gap-2">
                {examplePrompts.map((prompt, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, prompt }))}
                    className="text-left p-3 text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors"
                  >
                    "{prompt}"
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* AI Model Selection */}
        <div className="card">
          <div className="card-header">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              AI Model
            </h2>
          </div>
          <div className="card-body">
            <select
              value={formData.aiModel}
              onChange={handleModelChange}
              className="input-field"
              disabled={modelsLoading}
            >
              {modelsLoading ? (
                <option>Loading models...</option>
              ) : (
                models?.map((model: AIModel) => (
                  <option key={model.id} value={model.id}>
                    {model.name} ({model.provider})
                  </option>
                ))
              )}
            </select>
          </div>
        </div>

        {/* Technology Stack */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Frontend Framework */}
          <div className="card">
            <div className="card-header">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Frontend Framework
              </h3>
            </div>
            <div className="card-body">
              <select
                value={formData.framework}
                onChange={handleFrameworkChange}
                className="input-field"
              >
                {frameworks.map((framework) => (
                  <option key={framework.value} value={framework.value}>
                    {framework.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Backend Technology */}
          <div className="card">
            <div className="card-header">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Backend Technology
              </h3>
            </div>
            <div className="card-body">
              <select
                value={formData.backend}
                onChange={handleBackendChange}
                className="input-field"
              >
                {backends.map((backend) => (
                  <option key={backend.value} value={backend.value}>
                    {backend.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Database */}
          <div className="card">
            <div className="card-header">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Database
              </h3>
            </div>
            <div className="card-body">
              <select
                value={formData.database}
                onChange={handleDatabaseChange}
                className="input-field"
              >
                {databases.map((database) => (
                  <option key={database.value} value={database.value}>
                    {database.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="card">
          <div className="card-header">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Additional Features
            </h2>
          </div>
          <div className="card-body">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
              {features.map((feature) => (
                <label
                  key={feature}
                  className="flex items-center space-x-2 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={formData.features?.includes(feature)}
                    onChange={() => toggleFeature(feature)}
                    className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300 capitalize">
                    {feature.replace('-', ' ')}
                  </span>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Generate Button */}
        <div className="flex justify-center">
          <button
            type="submit"
            disabled={generateMutation.isLoading}
            className="btn-primary text-lg px-8 py-3 flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {generateMutation.isLoading ? (
              <>
                <SparklesIcon className="h-5 w-5 animate-spin" />
                <span>Generating...</span>
              </>
            ) : (
              <>
                <SparklesIcon className="h-5 w-5" />
                <span>Generate Application</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default GeneratePage;