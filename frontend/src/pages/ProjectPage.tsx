import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from 'react-query';
import apiService from '@/services/api';
import { Project, ProjectFile } from '@/types';
import {
  ArrowLeftIcon,
  ArrowDownTrayIcon,
  FolderIcon,
  DocumentIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
} from '@heroicons/react/24/outline';
import LoadingSpinner from '@/components/LoadingSpinner';
import toast from 'react-hot-toast';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { tomorrow } from 'react-syntax-highlighter/dist/esm/styles/prism';

const ProjectPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [selectedFile, setSelectedFile] = useState<ProjectFile | null>(null);
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set());

  const { data: project, isLoading, error } = useQuery(
    ['project', id],
    () => apiService.getProject(id!),
    {
      refetchInterval: (data) => {
        // Refetch every 5 seconds if project is still generating
        return data?.status === 'generating' ? 5000 : false;
      },
    }
  );

  const handleDownload = async () => {
    if (!project) return;
    
    try {
      const blob = await apiService.downloadProject(project.id);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${project.title}.zip`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      toast.success('Project downloaded successfully!');
    } catch (error) {
      toast.error('Failed to download project');
    }
  };

  const toggleFolder = (folderPath: string) => {
    const newExpanded = new Set(expandedFolders);
    if (newExpanded.has(folderPath)) {
      newExpanded.delete(folderPath);
    } else {
      newExpanded.add(folderPath);
    }
    setExpandedFolders(newExpanded);
  };

  const getFileIcon = (file: ProjectFile) => {
    if (file.type === 'directory') {
      return <FolderIcon className="h-4 w-4 text-blue-500" />;
    }
    
    const extension = file.path.split('.').pop()?.toLowerCase();
    switch (extension) {
      case 'js':
      case 'jsx':
      case 'ts':
      case 'tsx':
        return <DocumentIcon className="h-4 w-4 text-yellow-500" />;
      case 'css':
      case 'scss':
        return <DocumentIcon className="h-4 w-4 text-pink-500" />;
      case 'html':
        return <DocumentIcon className="h-4 w-4 text-orange-500" />;
      case 'json':
        return <DocumentIcon className="h-4 w-4 text-green-500" />;
      case 'md':
        return <DocumentIcon className="h-4 w-4 text-gray-500" />;
      default:
        return <DocumentIcon className="h-4 w-4 text-gray-400" />;
    }
  };

  const getLanguage = (filePath: string) => {
    const extension = filePath.split('.').pop()?.toLowerCase();
    switch (extension) {
      case 'js':
      case 'jsx':
        return 'javascript';
      case 'ts':
      case 'tsx':
        return 'typescript';
      case 'css':
        return 'css';
      case 'scss':
        return 'scss';
      case 'html':
        return 'html';
      case 'json':
        return 'json';
      case 'md':
        return 'markdown';
      case 'py':
        return 'python';
      case 'java':
        return 'java';
      case 'go':
        return 'go';
      case 'rs':
        return 'rust';
      default:
        return 'text';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircleIcon className="h-5 w-5 text-green-500" />;
      case 'failed':
        return <XCircleIcon className="h-5 w-5 text-red-500" />;
      case 'generating':
        return <ClockIcon className="h-5 w-5 text-yellow-500 animate-spin" />;
      default:
        return <ClockIcon className="h-5 w-5 text-gray-400" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed':
        return 'Completed';
      case 'failed':
        return 'Failed';
      case 'generating':
        return 'Generating';
      default:
        return 'Pending';
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600 dark:text-gray-300">Failed to load project</p>
        <Link to="/dashboard" className="btn-primary mt-4">
          Back to Dashboard
        </Link>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link
              to="/dashboard"
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              <ArrowLeftIcon className="h-5 w-5" />
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                {project.title}
              </h1>
              <p className="mt-2 text-gray-600 dark:text-gray-300">
                {project.description}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              {getStatusIcon(project.status)}
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {getStatusText(project.status)}
              </span>
            </div>
            {project.status === 'completed' && (
              <button
                onClick={handleDownload}
                className="btn-primary flex items-center space-x-2"
              >
                <ArrowDownTrayIcon className="h-5 w-5" />
                <span>Download</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Project Details */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* File Explorer */}
        <div className="lg:col-span-1">
          <div className="card">
            <div className="card-header">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Files
              </h2>
            </div>
            <div className="card-body">
              <div className="space-y-1">
                {project.files.map((file) => (
                  <div key={file.path}>
                    <button
                      onClick={() => {
                        if (file.type === 'directory') {
                          toggleFolder(file.path);
                        } else {
                          setSelectedFile(file);
                        }
                      }}
                      className={`w-full text-left px-2 py-1 rounded text-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${
                        selectedFile?.path === file.path
                          ? 'bg-primary-50 dark:bg-primary-900 text-primary-700 dark:text-primary-300'
                          : 'text-gray-700 dark:text-gray-300'
                      }`}
                    >
                      <div className="flex items-center space-x-2">
                        {getFileIcon(file)}
                        <span className="truncate">{file.path.split('/').pop()}</span>
                      </div>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Code Preview */}
        <div className="lg:col-span-3">
          <div className="card h-96">
            <div className="card-header">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                {selectedFile ? selectedFile.path : 'Select a file to preview'}
              </h2>
            </div>
            <div className="card-body p-0">
              {selectedFile ? (
                <div className="h-full">
                  <SyntaxHighlighter
                    language={getLanguage(selectedFile.path)}
                    style={tomorrow}
                    customStyle={{
                      margin: 0,
                      height: '100%',
                      fontSize: '14px',
                    }}
                    showLineNumbers
                  >
                    {selectedFile.content}
                  </SyntaxHighlighter>
                </div>
              ) : (
                <div className="flex items-center justify-center h-full text-gray-500 dark:text-gray-400">
                  <p>Select a file from the explorer to view its contents</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Project Metadata */}
      <div className="mt-8">
        <div className="card">
          <div className="card-header">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Project Details
            </h2>
          </div>
          <div className="card-body">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div>
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Framework
                </h3>
                <p className="mt-1 text-sm text-gray-900 dark:text-white">
                  {project.metadata.framework}
                </p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Backend
                </h3>
                <p className="mt-1 text-sm text-gray-900 dark:text-white">
                  {project.metadata.backend}
                </p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Database
                </h3>
                <p className="mt-1 text-sm text-gray-900 dark:text-white">
                  {project.metadata.database}
                </p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Complexity
                </h3>
                <p className="mt-1 text-sm text-gray-900 dark:text-white capitalize">
                  {project.metadata.complexity}
                </p>
              </div>
            </div>

            {project.metadata.features.length > 0 && (
              <div className="mt-6">
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                  Features
                </h3>
                <div className="flex flex-wrap gap-2">
                  {project.metadata.features.map((feature) => (
                    <span
                      key={feature}
                      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800 dark:bg-primary-900 dark:text-primary-200"
                    >
                      {feature.replace('-', ' ')}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {project.error && (
              <div className="mt-6">
                <h3 className="text-sm font-medium text-red-500 mb-2">
                  Error
                </h3>
                <p className="text-sm text-red-600 dark:text-red-400">
                  {project.error}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectPage;