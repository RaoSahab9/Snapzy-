import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import {
  SparklesIcon,
  CodeBracketIcon,
  RocketLaunchIcon,
  CpuChipIcon,
  GlobeAltIcon,
  ShieldCheckIcon,
} from '@heroicons/react/24/outline';

const HomePage: React.FC = () => {
  const { user } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const features = [
    {
      name: 'AI-Powered Generation',
      description: 'Describe your app in plain English and let AI generate complete code',
      icon: SparklesIcon,
    },
    {
      name: 'Multiple Frameworks',
      description: 'Support for React, Vue, Angular, Svelte, Next.js, and more',
      icon: CodeBracketIcon,
    },
    {
      name: 'Full-Stack Ready',
      description: 'Complete frontend, backend, database, and deployment configs',
      icon: RocketLaunchIcon,
    },
    {
      name: 'Multi-Model Support',
      description: 'OpenAI, Claude, Gemini, Llama, and local models',
      icon: CpuChipIcon,
    },
    {
      name: 'Production Ready',
      description: 'Generated code follows best practices and security standards',
      icon: ShieldCheckIcon,
    },
    {
      name: 'Instant Deployment',
      description: 'Ready-to-deploy configurations for Vercel, Render, Railway',
      icon: GlobeAltIcon,
    },
  ];

  const examplePrompts = [
    'Create a blog application with user authentication, post creation, and commenting system',
    'Build an e-commerce platform with product catalog, shopping cart, and payment integration',
    'Develop a task management app with user registration, project creation, and progress tracking',
    'Generate a social media platform with user profiles, posts, likes, and real-time messaging',
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      {/* Header */}
      <header className="relative">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center">
              <div className="text-2xl font-bold text-gradient">OM</div>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={toggleTheme}
                className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
              >
                {theme.mode === 'dark' ? (
                  <SparklesIcon className="h-5 w-5" />
                ) : (
                  <SparklesIcon className="h-5 w-5" />
                )}
              </button>
              {user ? (
                <Link
                  to="/dashboard"
                  className="btn-primary"
                >
                  Dashboard
                </Link>
              ) : (
                <div className="flex items-center space-x-4">
                  <Link
                    to="/login"
                    className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="btn-primary"
                  >
                    Get Started
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-6xl">
              Transform Your Ideas Into
              <span className="text-gradient"> Reality</span>
            </h1>
            <p className="mt-6 text-lg leading-8 text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              OM is an AI-powered application generator that creates complete full-stack codebases from plain English descriptions. 
              Describe any app or website, and get production-ready code instantly.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              {user ? (
                <Link
                  to="/generate"
                  className="btn-primary text-lg px-8 py-3"
                >
                  Generate New App
                </Link>
              ) : (
                <Link
                  to="/register"
                  className="btn-primary text-lg px-8 py-3"
                >
                  Start Building
                </Link>
              )}
              <Link
                to="#features"
                className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
              >
                Learn More →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 bg-gray-50 dark:bg-gray-800">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
              Everything You Need to Build
            </h2>
            <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
              OM generates complete applications with all the modern features you need
            </p>
          </div>
          <div className="mt-20 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => (
              <div
                key={feature.name}
                className="card p-6 hover:shadow-lg transition-shadow"
              >
                <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-primary-600">
                  <feature.icon className="h-6 w-6 text-white" />
                </div>
                <h3 className="mt-4 text-lg font-semibold text-gray-900 dark:text-white">
                  {feature.name}
                </h3>
                <p className="mt-2 text-gray-600 dark:text-gray-300">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Example Prompts */}
      <section className="py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
              Just Describe What You Want
            </h2>
            <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
              Here are some example prompts to get you started
            </p>
          </div>
          <div className="mt-12 grid grid-cols-1 gap-6 lg:grid-cols-2">
            {examplePrompts.map((prompt, index) => (
              <div
                key={index}
                className="card p-6 hover:shadow-lg transition-shadow"
              >
                <p className="text-gray-700 dark:text-gray-300 italic">
                  "{prompt}"
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-primary-600">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Ready to Build Something Amazing?
          </h2>
          <p className="mt-4 text-lg text-primary-100">
            Join thousands of developers who are already using OM to create incredible applications
          </p>
          <div className="mt-8">
            {user ? (
              <Link
                to="/generate"
                className="bg-white text-primary-600 hover:bg-gray-50 font-medium py-3 px-8 rounded-lg transition-colors"
              >
                Generate Your First App
              </Link>
            ) : (
              <Link
                to="/register"
                className="bg-white text-primary-600 hover:bg-gray-50 font-medium py-3 px-8 rounded-lg transition-colors"
              >
                Get Started Free
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <div className="text-2xl font-bold text-gradient mb-4">OM</div>
            <p className="text-gray-400">
              Transform your ideas into reality with AI-powered code generation
            </p>
            <div className="mt-8 text-sm text-gray-400">
              © 2024 OM. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;