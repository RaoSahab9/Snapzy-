import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from 'react-query';
import { useAuth } from '@/contexts/AuthContext';
import apiService from '@/services/api';
import { Project } from '@/types';
import {
  PlusIcon,
  FolderIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  ArrowDownTrayIcon,
  TrashIcon,
} from '@heroicons/react/24/outline';
import LoadingSpinner from '@/components/LoadingSpinner';
import toast from 'react-hot-toast';

const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const [page, setPage] = useState(1);
  const [limit] = useState(10);

  const { data, isLoading, error, refetch } = useQuery(
    ['projects', page, limit],
    () => apiService.getProjects(page, limit),
    {
      keepPreviousData: true,
    }
  );

  const handleDownload = async (projectId: string) => {
    try {
      const blob = await apiService.downloadProject(projectId);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `project-${projectId}.zip`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      toast.success('Project downloaded successfully!');
    } catch (error) {
      toast.error('Failed to download project');
    }
  };

  const handleDelete = async (projectId: string) => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      try {
        await apiService.deleteProject(projectId);
        toast.success('Project deleted successfully!');
        refetch();
      } catch (error) {
        toast.error('Failed to delete project');
      }
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

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600 dark:text-gray-300">Failed to load projects</p>
        <button
          onClick={() => refetch()}
          className="btn-primary mt-4"
        >
          Try Again
        </button>
      </div>
    );
  }

  const projects = data?.projects || [];
  const pagination = data?.pagination;

  return (
    <div>
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Dashboard
            </h1>
            <p className="mt-2 text-gray-600 dark:text-gray-300">
              Welcome back, {user?.username}! Here are your generated projects.
            </p>
          </div>
          <Link
            to="/generate"
            className="btn-primary flex items-center space-x-2"
          >
            <PlusIcon className="h-5 w-5" />
            <span>Generate New App</span>
          </Link>
        </div>
      </div>

      {projects.length === 0 ? (
        <div className="text-center py-12">
          <FolderIcon className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">
            No projects yet
          </h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Get started by generating your first application.
          </p>
          <div className="mt-6">
            <Link
              to="/generate"
              className="btn-primary"
            >
              Generate Your First App
            </Link>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {projects.map((project: Project) => (
              <div key={project.id} className="card hover:shadow-lg transition-shadow">
                <div className="card-header">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white truncate">
                      {project.title}
                    </h3>
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(project.status)}
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        {getStatusText(project.status)}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="card-body">
                  <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-2">
                    {project.description}
                  </p>
                  
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                      <span className="font-medium">Framework:</span>
                      <span className="ml-2">{project.metadata.framework}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                      <span className="font-medium">Backend:</span>
                      <span className="ml-2">{project.metadata.backend}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                      <span className="font-medium">Database:</span>
                      <span className="ml-2">{project.metadata.database}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {new Date(project.createdAt).toLocaleDateString()}
                    </span>
                    <div className="flex items-center space-x-2">
                      {project.status === 'completed' && (
                        <button
                          onClick={() => handleDownload(project.id)}
                          className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                          title="Download project"
                        >
                          <ArrowDownTrayIcon className="h-4 w-4" />
                        </button>
                      )}
                      <Link
                        to={`/project/${project.id}`}
                        className="text-primary-600 hover:text-primary-500 text-sm font-medium"
                      >
                        View Details
                      </Link>
                      <button
                        onClick={() => handleDelete(project.id)}
                        className="p-1 text-gray-400 hover:text-red-600"
                        title="Delete project"
                      >
                        <TrashIcon className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {pagination && pagination.totalPages > 1 && (
            <div className="flex items-center justify-center space-x-2">
              <button
                onClick={() => setPage(page - 1)}
                disabled={page === 1}
                className="btn-outline px-3 py-1 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <span className="text-sm text-gray-600 dark:text-gray-300">
                Page {page} of {pagination.totalPages}
              </span>
              <button
                onClick={() => setPage(page + 1)}
                disabled={page === pagination.totalPages}
                className="btn-outline px-3 py-1 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default DashboardPage;