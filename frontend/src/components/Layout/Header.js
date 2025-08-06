import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTheme } from '../../contexts/ThemeContext';
import { Sun, Moon, Zap } from 'lucide-react';

const Header = () => {
  const { isDark, toggleTheme } = useTheme();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <header className="bg-white/80 dark:bg-secondary-900/80 backdrop-blur-md border-b border-secondary-200 dark:border-secondary-700 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 group">
            <div className="p-2 bg-primary-600 rounded-lg group-hover:bg-primary-700 transition-colors">
              <Zap className="h-6 w-6 text-white" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-primary-600 to-primary-800 bg-clip-text text-transparent">
              OM
            </span>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link
              to="/"
              className={`text-sm font-medium transition-colors hover:text-primary-600 ${
                isActive('/') 
                  ? 'text-primary-600 dark:text-primary-400' 
                  : 'text-secondary-600 dark:text-secondary-300'
              }`}
            >
              Home
            </Link>
            <Link
              to="/generate"
              className={`text-sm font-medium transition-colors hover:text-primary-600 ${
                isActive('/generate') 
                  ? 'text-primary-600 dark:text-primary-400' 
                  : 'text-secondary-600 dark:text-secondary-300'
              }`}
            >
              Generate
            </Link>
          </nav>

          {/* Actions */}
          <div className="flex items-center space-x-4">
            {/* Theme toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg hover:bg-secondary-100 dark:hover:bg-secondary-800 transition-colors"
              aria-label="Toggle theme"
            >
              {isDark ? (
                <Sun className="h-5 w-5 text-secondary-600 dark:text-secondary-300" />
              ) : (
                <Moon className="h-5 w-5 text-secondary-600 dark:text-secondary-300" />
              )}
            </button>

            {/* CTA Button */}
            <Link
              to="/generate"
              className="btn-primary px-4 py-2 text-sm"
            >
              Start Building
            </Link>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div className="md:hidden border-t border-secondary-200 dark:border-secondary-700">
        <div className="px-4 py-3 space-y-1">
          <Link
            to="/"
            className={`block px-3 py-2 rounded-md text-sm font-medium transition-colors ${
              isActive('/') 
                ? 'bg-primary-50 text-primary-600 dark:bg-primary-900/20 dark:text-primary-400' 
                : 'text-secondary-600 dark:text-secondary-300 hover:bg-secondary-50 dark:hover:bg-secondary-800'
            }`}
          >
            Home
          </Link>
          <Link
            to="/generate"
            className={`block px-3 py-2 rounded-md text-sm font-medium transition-colors ${
              isActive('/generate') 
                ? 'bg-primary-50 text-primary-600 dark:bg-primary-900/20 dark:text-primary-400' 
                : 'text-secondary-600 dark:text-secondary-300 hover:bg-secondary-50 dark:hover:bg-secondary-800'
            }`}
          >
            Generate
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Header;