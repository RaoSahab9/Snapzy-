import React from 'react';
import { Link } from 'react-router-dom';
import { Home, ArrowLeft } from 'lucide-react';

const NotFoundPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center">
        <div className="text-6xl mb-4">🤖</div>
        <h1 className="text-4xl font-bold text-secondary-900 dark:text-white mb-4">
          404 - Page Not Found
        </h1>
        <p className="text-lg text-secondary-600 dark:text-secondary-300 mb-8 max-w-md">
          The page you're looking for doesn't exist. Maybe it was moved or deleted?
        </p>
        <div className="flex items-center justify-center gap-4">
          <Link
            to="/"
            className="btn-primary flex items-center"
          >
            <Home className="h-4 w-4 mr-2" />
            Go Home
          </Link>
          <button
            onClick={() => window.history.back()}
            className="btn-ghost flex items-center"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Go Back
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;