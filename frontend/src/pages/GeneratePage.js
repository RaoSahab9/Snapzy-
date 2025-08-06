import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProject } from '../contexts/ProjectContext';
import { apiService } from '../services/api';
import { toast } from 'react-hot-toast';
import { 
  Sparkles, 
  Send, 
  Lightbulb, 
  RefreshCw,
  ChevronDown,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

const GeneratePage = () => {
  const navigate = useNavigate();
  const { addProject, setIsGenerating } = useProject();
  
  const [prompt, setPrompt] = useState('');
  const [selectedModel, setSelectedModel] = useState('openai-gpt4');
  const [models, setModels] = useState([]);
  const [templates, setTemplates] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    fetchModels();
    fetchTemplates();
  }, []);

  const fetchModels = async () => {
    try {
      const response = await apiService.getModels();
      setModels(response.models || []);
      
      // Set default to first available model
      const availableModel = response.models?.find(m => m.available);
      if (availableModel) {
        setSelectedModel(availableModel.id);
      }
    } catch (error) {
      console.error('Failed to fetch models:', error);
      toast.error('Failed to load AI models');
    }
  };

  const fetchTemplates = async () => {
    try {
      const response = await apiService.getTemplates();
      setTemplates(response.templates || {});
    } catch (error) {
      console.error('Failed to fetch templates:', error);
    }
  };

  const handleTemplateSelect = (template) => {
    setPrompt(template.prompt);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!prompt.trim()) {
      toast.error('Please enter a project description');
      return;
    }

    if (!selectedModel) {
      toast.error('Please select an AI model');
      return;
    }

    const selectedModelData = models.find(m => m.id === selectedModel);
    if (!selectedModelData?.available) {
      toast.error('Selected AI model is not available. Please check API configuration.');
      return;
    }

    setIsLoading(true);
    setIsGenerating(true);

    try {
      const response = await apiService.generateProject({
        prompt: prompt.trim(),
        aiModel: selectedModel,
        options: {
          includeTests: true,
          includeDocker: false,
          includeCICD: false
        }
      });

      if (response.success) {
        toast.success('Project generation started!');
        
        // Add project to context
        addProject({
          projectId: response.projectId,
          prompt: prompt.trim(),
          aiModel: selectedModel,
          status: 'generating',
          createdAt: new Date().toISOString()
        });

        // Navigate to result page
        navigate(`/result/${response.projectId}`);
      }
    } catch (error) {
      console.error('Generation error:', error);
      toast.error(error.message || 'Failed to start project generation');
      setIsGenerating(false);
    } finally {
      setIsLoading(false);
    }
  };

  const selectedModelData = models.find(m => m.id === selectedModel);

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center rounded-full px-4 py-1.5 text-sm leading-6 text-primary-600 ring-1 ring-primary-600/20 mb-6">
            <Sparkles className="h-4 w-4 mr-2" />
            AI App Generator
          </div>
          
          <h1 className="text-4xl sm:text-5xl font-bold text-secondary-900 dark:text-white mb-4">
            Describe Your Dream App
          </h1>
          
          <p className="text-xl text-secondary-600 dark:text-secondary-300 max-w-2xl mx-auto">
            Tell us what you want to build and our AI will generate a complete, 
            production-ready application for you.
          </p>
        </div>

        {/* Templates */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-secondary-900 dark:text-white mb-4 flex items-center">
            <Lightbulb className="h-5 w-5 mr-2 text-primary-600" />
            Quick Start Templates
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.entries(templates).map(([key, template]) => (
              <button
                key={key}
                onClick={() => handleTemplateSelect(template)}
                className="p-4 text-left border border-secondary-200 dark:border-secondary-700 rounded-lg hover:border-primary-300 hover:bg-primary-50/50 dark:hover:bg-primary-900/10 transition-all duration-200"
              >
                <h3 className="font-medium text-secondary-900 dark:text-white mb-2">
                  {template.description}
                </h3>
                <p className="text-sm text-secondary-600 dark:text-secondary-400 line-clamp-2">
                  {template.prompt}
                </p>
              </button>
            ))}
          </div>
        </div>

        {/* Main Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* AI Model Selection */}
          <div>
            <label className="block text-sm font-medium text-secondary-900 dark:text-white mb-3">
              Choose AI Model
            </label>
            
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowDropdown(!showDropdown)}
                className="w-full flex items-center justify-between px-4 py-3 border border-secondary-300 dark:border-secondary-600 rounded-lg bg-white dark:bg-secondary-800 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              >
                <div className="flex items-center space-x-3">
                  {selectedModelData?.available ? (
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  ) : (
                    <AlertCircle className="h-5 w-5 text-red-500" />
                  )}
                  <div className="text-left">
                    <div className="font-medium text-secondary-900 dark:text-white">
                      {selectedModelData?.name || 'Select Model'}
                    </div>
                    <div className="text-sm text-secondary-500 dark:text-secondary-400">
                      {selectedModelData?.provider} - {selectedModelData?.description}
                    </div>
                  </div>
                </div>
                <ChevronDown className="h-5 w-5 text-secondary-400" />
              </button>

              {showDropdown && (
                <div className="absolute top-full mt-1 w-full bg-white dark:bg-secondary-800 border border-secondary-200 dark:border-secondary-600 rounded-lg shadow-lg z-10 max-h-60 overflow-y-auto">
                  {models.map((model) => (
                    <button
                      key={model.id}
                      type="button"
                      onClick={() => {
                        setSelectedModel(model.id);
                        setShowDropdown(false);
                      }}
                      className="w-full flex items-center space-x-3 px-4 py-3 hover:bg-secondary-50 dark:hover:bg-secondary-700 transition-colors"
                    >
                      {model.available ? (
                        <CheckCircle className="h-5 w-5 text-green-500" />
                      ) : (
                        <AlertCircle className="h-5 w-5 text-red-500" />
                      )}
                      <div className="text-left flex-1">
                        <div className="font-medium text-secondary-900 dark:text-white">
                          {model.name}
                        </div>
                        <div className="text-sm text-secondary-500 dark:text-secondary-400">
                          {model.provider} - {model.description}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Prompt Input */}
          <div>
            <label className="block text-sm font-medium text-secondary-900 dark:text-white mb-3">
              Describe Your App
            </label>
            
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Example: Create a blog website with user authentication, post creation, editing, commenting system, and admin panel. Include user profiles, categories, search functionality, and responsive design."
              rows={6}
              className="textarea w-full resize-none"
              required
            />
            
            <div className="mt-2 text-sm text-secondary-500 dark:text-secondary-400">
              Be specific about features, user roles, and functionality you want.
            </div>
          </div>

          {/* Generate Button */}
          <div className="pt-6">
            <button
              type="submit"
              disabled={isLoading || !selectedModelData?.available}
              className="w-full btn-primary py-4 text-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <RefreshCw className="h-5 w-5 mr-2 animate-spin" />
                  Generating Your App...
                </>
              ) : (
                <>
                  <Send className="h-5 w-5 mr-2" />
                  Generate My App
                </>
              )}
            </button>
            
            {!selectedModelData?.available && (
              <p className="mt-2 text-sm text-red-600 dark:text-red-400 text-center">
                Selected AI model is not available. Please configure API keys or choose a local model.
              </p>
            )}
          </div>
        </form>

        {/* Info Cards */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="card p-6 text-center">
            <div className="text-2xl mb-2">⚡</div>
            <h3 className="font-semibold text-secondary-900 dark:text-white mb-2">
              Fast Generation
            </h3>
            <p className="text-sm text-secondary-600 dark:text-secondary-400">
              Complete apps in 2-5 minutes
            </p>
          </div>
          
          <div className="card p-6 text-center">
            <div className="text-2xl mb-2">🔧</div>
            <h3 className="font-semibold text-secondary-900 dark:text-white mb-2">
              Production Ready
            </h3>
            <p className="text-sm text-secondary-600 dark:text-secondary-400">
              Industry-standard code
            </p>
          </div>
          
          <div className="card p-6 text-center">
            <div className="text-2xl mb-2">📦</div>
            <h3 className="font-semibold text-secondary-900 dark:text-white mb-2">
              Instant Download
            </h3>
            <p className="text-sm text-secondary-600 dark:text-secondary-400">
              Download as ZIP file
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GeneratePage;