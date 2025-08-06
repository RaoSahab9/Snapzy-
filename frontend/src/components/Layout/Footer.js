import React from 'react';
import { Zap, Github, Twitter, Mail } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-white dark:bg-secondary-900 border-t border-secondary-200 dark:border-secondary-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-primary-600 rounded-lg">
                <Zap className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-primary-600 to-primary-800 bg-clip-text text-transparent">
                OM
              </span>
            </div>
            <p className="text-sm text-secondary-600 dark:text-secondary-400">
              Transform your ideas into production-ready applications with the power of AI.
            </p>
          </div>

          {/* Product */}
          <div>
            <h3 className="text-sm font-semibold text-secondary-900 dark:text-white mb-4">
              Product
            </h3>
            <ul className="space-y-2">
              <li>
                <a href="#features" className="text-sm text-secondary-600 dark:text-secondary-400 hover:text-primary-600 transition-colors">
                  Features
                </a>
              </li>
              <li>
                <a href="#pricing" className="text-sm text-secondary-600 dark:text-secondary-400 hover:text-primary-600 transition-colors">
                  Pricing
                </a>
              </li>
              <li>
                <a href="#api" className="text-sm text-secondary-600 dark:text-secondary-400 hover:text-primary-600 transition-colors">
                  API
                </a>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-sm font-semibold text-secondary-900 dark:text-white mb-4">
              Support
            </h3>
            <ul className="space-y-2">
              <li>
                <a href="#docs" className="text-sm text-secondary-600 dark:text-secondary-400 hover:text-primary-600 transition-colors">
                  Documentation
                </a>
              </li>
              <li>
                <a href="#help" className="text-sm text-secondary-600 dark:text-secondary-400 hover:text-primary-600 transition-colors">
                  Help Center
                </a>
              </li>
              <li>
                <a href="#status" className="text-sm text-secondary-600 dark:text-secondary-400 hover:text-primary-600 transition-colors">
                  Status
                </a>
              </li>
            </ul>
          </div>

          {/* Connect */}
          <div>
            <h3 className="text-sm font-semibold text-secondary-900 dark:text-white mb-4">
              Connect
            </h3>
            <div className="flex space-x-4">
              <a 
                href="#github" 
                className="text-secondary-600 dark:text-secondary-400 hover:text-primary-600 transition-colors"
                aria-label="GitHub"
              >
                <Github className="h-5 w-5" />
              </a>
              <a 
                href="#twitter" 
                className="text-secondary-600 dark:text-secondary-400 hover:text-primary-600 transition-colors"
                aria-label="Twitter"
              >
                <Twitter className="h-5 w-5" />
              </a>
              <a 
                href="#email" 
                className="text-secondary-600 dark:text-secondary-400 hover:text-primary-600 transition-colors"
                aria-label="Email"
              >
                <Mail className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-secondary-200 dark:border-secondary-700">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-secondary-600 dark:text-secondary-400">
              © 2024 OM AI Generator. All rights reserved.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="#privacy" className="text-sm text-secondary-600 dark:text-secondary-400 hover:text-primary-600 transition-colors">
                Privacy Policy
              </a>
              <a href="#terms" className="text-sm text-secondary-600 dark:text-secondary-400 hover:text-primary-600 transition-colors">
                Terms of Service
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;