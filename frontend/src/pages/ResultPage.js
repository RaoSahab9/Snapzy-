import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useProject } from '../contexts/ProjectContext';
import { apiService } from '../services/api';
import { toast } from 'react-hot-toast';
import { 
  Download, 
  RefreshCw, 
  CheckCircle, 
  XCircle, 
  Clock, 
  FileText,
  Folder,
  ArrowLeft
} from 'lucide-react';

const ResultPage = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const { updateProject, getProject, setIsGenerating } = useProject();
  
  const [project, setProject] = useState(null);
  const [isPolling, setIsPolling] = useState(true);
  const [downloadInfo, setDownloadInfo] = useState(null);

  useEffect(() => {
    if (projectId) {
      fetchProjectStatus();
      
      // Start polling for status updates
      const interval = setInterval(() => {
        if (isPolling) {
          fetchProjectStatus();
        }
      }, 3000);

      return () => clearInterval(interval);
    }
  }, [projectId, isPolling]);

  const fetchProjectStatus = async () => {
    try {
      const response = await apiService.getProjectStatus(projectId);
      
      if (response.success) {
        const projectData = response.project;
        setProject(projectData);
        updateProject(projectId, projectData);

        // Stop polling if generation is complete or failed
        if (projectData.status === 'completed' || projectData.status === 'failed') {
          setIsPolling(false);
          setIsGenerating(false);
          
          if (projectData.status === 'completed') {
            fetchDownloadInfo();
          }
        }
      }
    } catch (error) {
      console.error('Failed to fetch project status:', error);
      toast.error('Failed to check project status');
    }
  };

  const fetchDownloadInfo = async () => {
    try {
      const response = await apiService.getDownloadInfo(projectId);
      if (response.success) {
        setDownloadInfo(response.download);
      }
    } catch (error) {
      console.error('Failed to fetch download info:', error);
    }
  };

  const handleDownload = async () => {
    try {
      toast.loading('Preparing download...', { id: 'download' });
      
      const response = await apiService.downloadProject(projectId);
      
      // Create blob and download
      const blob = new Blob([response.data], { type: 'application/zip' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${project.projectName.replace(/[^a-zA-Z0-9]/g, '_')}_${projectId.slice(0, 8)}.zip`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      toast.success('Download completed!', { id: 'download' });
    } catch (error) {
      console.error('Download failed:', error);
      toast.error('Download failed. Please try again.', { id: 'download' });
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'generating':
        return <RefreshCw className="h-8 w-8 text-blue-500 animate-spin" />;
      case 'completed':
        return <CheckCircle className="h-8 w-8 text-green-500" />;
      case 'failed':
        return <XCircle className="h-8 w-8 text-red-500" />;
      default:
        return <Clock className="h-8 w-8 text-gray-500" />;
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'generating':
        return 'Generating your application...';
      case 'completed':
        return 'Your application is ready!';
      case 'failed':
        return 'Generation failed';
      default:
        return 'Unknown status';
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  if (!project) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4 text-primary-600" />
          <p className="text-secondary-600 dark:text-secondary-300">Loading project...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <button
          onClick={() => navigate('/generate')}
          className="btn-ghost mb-8 flex items-center"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Generator
        </button>

        {/* Status Card */}
        <div className="card p-8 mb-8 text-center">
          <div className="mb-6">
            {getStatusIcon(project.status)}
          </div>
          
          <h1 className="text-3xl font-bold text-secondary-900 dark:text-white mb-4">
            {getStatusText(project.status)}
          </h1>
          
          <p className="text-lg text-secondary-600 dark:text-secondary-300 mb-6">
            {project.projectName}
          </p>

          {project.status === 'generating' && (
            <div className="mb-6">
              <div className="w-full bg-secondary-200 dark:bg-secondary-700 rounded-full h-2">
                <div className="bg-primary-600 h-2 rounded-full animate-pulse" style={{ width: '60%' }}></div>
              </div>
              <p className="text-sm text-secondary-500 dark:text-secondary-400 mt-2">
                This usually takes 2-5 minutes...
              </p>
            </div>
          )}

          {project.status === 'completed' && downloadInfo && (
            <button
              onClick={handleDownload}
              className="btn-primary px-8 py-3 text-lg font-semibold"
            >
              <Download className="h-5 w-5 mr-2" />
              Download Project ({formatFileSize(downloadInfo.zipSize)})
            </button>
          )}

          {project.status === 'failed' && (
            <div className="text-red-600 dark:text-red-400">
              <p className="mb-4">{project.errorMessage || 'An error occurred during generation'}</p>
              <button
                onClick={() => navigate('/generate')}
                className="btn-primary"
              >
                Try Again
              </button>
            </div>
          )}
        </div>

        {/* Project Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="card p-6">
            <h2 className="text-lg font-semibold text-secondary-900 dark:text-white mb-4">
              Project Details
            </h2>
            
            <div className="space-y-3">
              <div>
                <span className="text-sm font-medium text-secondary-600 dark:text-secondary-400">AI Model:</span>
                <p className="text-secondary-900 dark:text-white">{project.aiModel}</p>
              </div>
              
              <div>
                <span className="text-sm font-medium text-secondary-600 dark:text-secondary-400">Created:</span>
                <p className="text-secondary-900 dark:text-white">
                  {new Date(project.createdAt).toLocaleString()}
                </p>
              </div>
              
              {project.metadata?.generationTime && (
                <div>
                  <span className="text-sm font-medium text-secondary-600 dark:text-secondary-400">Generation Time:</span>
                  <p className="text-secondary-900 dark:text-white">
                    {Math.round(project.metadata.generationTime / 1000)}s
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className="card p-6">
            <h2 className="text-lg font-semibold text-secondary-900 dark:text-white mb-4">
              Tech Stack
            </h2>
            
            {project.techStack ? (
              <div className="space-y-3">
                {Object.entries(project.techStack).map(([key, value]) => (
                  <div key={key}>
                    <span className="text-sm font-medium text-secondary-600 dark:text-secondary-400 capitalize">
                      {key}:
                    </span>
                    <p className="text-secondary-900 dark:text-white capitalize">{value}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-secondary-500 dark:text-secondary-400">
                Tech stack will be available when generation completes
              </p>
            )}
          </div>
        </div>

        {/* Generation Stats */}
        {project.metadata && (
          <div className="card p-6">
            <h2 className="text-lg font-semibold text-secondary-900 dark:text-white mb-4">
              Generation Statistics
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <FileText className="h-8 w-8 mx-auto mb-2 text-primary-600" />
                <p className="text-2xl font-bold text-secondary-900 dark:text-white">
                  {project.metadata.totalFiles || '—'}
                </p>
                <p className="text-sm text-secondary-500 dark:text-secondary-400">Files Generated</p>
              </div>
              
              <div className="text-center">
                <Folder className="h-8 w-8 mx-auto mb-2 text-primary-600" />
                <p className="text-2xl font-bold text-secondary-900 dark:text-white">
                  {project.metadata.totalLines || '—'}
                </p>
                <p className="text-sm text-secondary-500 dark:text-secondary-400">Lines of Code</p>
              </div>
              
              <div className="text-center">
                <Download className="h-8 w-8 mx-auto mb-2 text-primary-600" />
                <p className="text-2xl font-bold text-secondary-900 dark:text-white">
                  {project.metadata.zipSize ? formatFileSize(project.metadata.zipSize) : '—'}
                </p>
                <p className="text-sm text-secondary-500 dark:text-secondary-400">Package Size</p>
              </div>
            </div>
          </div>
        )}

        {/* Original Prompt */}
        <div className="card p-6 mt-6">
          <h2 className="text-lg font-semibold text-secondary-900 dark:text-white mb-4">
            Original Prompt
          </h2>
          <p className="text-secondary-700 dark:text-secondary-300 bg-secondary-50 dark:bg-secondary-800 p-4 rounded-lg">
            "{project.prompt}"
          </p>
        </div>
      </div>
    </div>
  );
};

export default ResultPage;