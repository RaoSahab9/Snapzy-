import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Zap, 
  Code, 
  Database, 
  Cloud, 
  Sparkles, 
  ArrowRight,
  CheckCircle,
  Globe,
  Smartphone,
  Server
} from 'lucide-react';

const HomePage = () => {
  const features = [
    {
      icon: <Code className="h-8 w-8" />,
      title: "Full-Stack Generation",
      description: "Complete frontend, backend, and database code generation in minutes"
    },
    {
      icon: <Sparkles className="h-8 w-8" />,
      title: "AI-Powered",
      description: "Multiple AI models including GPT-4, Claude, Gemini, and local models"
    },
    {
      icon: <Database className="h-8 w-8" />,
      title: "Production Ready",
      description: "Industry-standard practices, security, and deployment configuration"
    },
    {
      icon: <Cloud className="h-8 w-8" />,
      title: "Instant Deploy",
      description: "Ready for Vercel, Netlify, Railway, and Docker deployment"
    }
  ];

  const techStack = [
    { name: "React", icon: "⚛️" },
    { name: "Vue.js", icon: "💚" },
    { name: "Angular", icon: "🅰️" },
    { name: "Node.js", icon: "💻" },
    { name: "Python", icon: "🐍" },
    { name: "MongoDB", icon: "🍃" },
    { name: "PostgreSQL", icon: "🐘" },
    { name: "Docker", icon: "🐳" }
  ];

  const examples = [
    "Create a blog website with user authentication and comment system",
    "Build an e-commerce store with shopping cart and payment integration",
    "Develop a task management app with real-time collaboration",
    "Generate a social media platform with posts and messaging",
    "Create an analytics dashboard with charts and data visualization"
  ];

  return (
    <div className="overflow-hidden">
      {/* Hero Section */}
      <section className="relative py-20 sm:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="inline-flex items-center rounded-full px-4 py-1.5 text-sm leading-6 text-primary-600 ring-1 ring-primary-600/20 hover:ring-primary-600/30 transition-all duration-300 mb-8">
              <Sparkles className="h-4 w-4 mr-2" />
              AI-Powered App Generation
            </div>
            
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-secondary-900 dark:text-white">
              Transform{' '}
              <span className="bg-gradient-to-r from-primary-600 via-purple-600 to-primary-800 bg-clip-text text-transparent">
                Ideas
              </span>{' '}
              into Apps
            </h1>
            
            <p className="mt-6 text-lg sm:text-xl leading-8 text-secondary-600 dark:text-secondary-300 max-w-3xl mx-auto text-balance">
              Describe your app in plain English and watch as OM generates complete, 
              production-ready full-stack applications with frontend, backend, database, 
              and deployment configuration.
            </p>
            
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <Link
                to="/generate"
                className="btn-primary px-8 py-3 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
              >
                Start Building
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
              <a
                href="#demo"
                className="btn-ghost text-lg font-semibold"
              >
                Watch Demo
                <span className="ml-2">🎥</span>
              </a>
            </div>
          </div>
        </div>

        {/* Floating Elements */}
        <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-primary-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse-slow"></div>
        <div className="absolute top-1/3 right-1/4 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse-slow animation-delay-2000"></div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white/50 dark:bg-secondary-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl sm:text-4xl font-bold text-secondary-900 dark:text-white">
              Everything you need to build modern apps
            </h2>
            <p className="mt-4 text-lg text-secondary-600 dark:text-secondary-300 max-w-2xl mx-auto">
              From idea to deployment in minutes, not months
            </p>
          </div>

          <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div 
                key={index}
                className="card p-6 hover:shadow-lg transition-all duration-300 group"
              >
                <div className="text-primary-600 group-hover:text-primary-700 transition-colors">
                  {feature.icon}
                </div>
                <h3 className="mt-4 text-lg font-semibold text-secondary-900 dark:text-white">
                  {feature.title}
                </h3>
                <p className="mt-2 text-secondary-600 dark:text-secondary-400">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tech Stack Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl sm:text-4xl font-bold text-secondary-900 dark:text-white">
              Works with your favorite tech stack
            </h2>
            <p className="mt-4 text-lg text-secondary-600 dark:text-secondary-300">
              Generate apps using modern frameworks and databases
            </p>
          </div>

          <div className="mt-12 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-6">
            {techStack.map((tech, index) => (
              <div 
                key={index}
                className="flex flex-col items-center p-4 rounded-lg hover:bg-white/50 dark:hover:bg-secondary-800/50 transition-colors"
              >
                <span className="text-3xl mb-2">{tech.icon}</span>
                <span className="text-sm font-medium text-secondary-600 dark:text-secondary-400">
                  {tech.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Examples Section */}
      <section className="py-20 bg-white/50 dark:bg-secondary-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl sm:text-4xl font-bold text-secondary-900 dark:text-white">
              What can you build?
            </h2>
            <p className="mt-4 text-lg text-secondary-600 dark:text-secondary-300">
              Just describe your idea and let OM handle the rest
            </p>
          </div>

          <div className="mt-12 space-y-4 max-w-3xl mx-auto">
            {examples.map((example, index) => (
              <div 
                key={index}
                className="flex items-start space-x-3 p-4 rounded-lg hover:bg-white dark:hover:bg-secondary-800 transition-colors"
              >
                <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                <span className="text-secondary-700 dark:text-secondary-300">
                  "{example}"
                </span>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <Link
              to="/generate"
              className="btn-primary px-8 py-3 text-lg font-semibold"
            >
              Try It Now
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="card p-12 bg-gradient-to-r from-primary-600 to-primary-800 text-white">
            <Zap className="h-12 w-12 mx-auto mb-6" />
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Ready to build your next app?
            </h2>
            <p className="text-xl text-primary-100 mb-8">
              Join thousands of developers who are already building with OM
            </p>
            <Link
              to="/generate"
              className="inline-flex items-center px-8 py-3 bg-white text-primary-600 font-semibold rounded-lg hover:bg-primary-50 transition-colors"
            >
              Get Started for Free
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;