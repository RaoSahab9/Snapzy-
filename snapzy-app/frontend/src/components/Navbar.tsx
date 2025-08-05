import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Home, Search, PlusSquare, Heart, User, LogOut, Settings, Camera } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [showUserMenu, setShowUserMenu] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { icon: Home, label: 'Home', path: '/' },
    { icon: Search, label: 'Search', path: '/search' },
    { icon: PlusSquare, label: 'Create', path: '/upload' },
    { icon: Heart, label: 'Activity', path: '/activity' },
  ];

  const isActive = (path: string) => location.pathname === path;

  if (!user) return null;

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <Camera className="h-8 w-8 text-snapzy-primary" />
            <span className="text-2xl font-bold gradient-text">Snapzy</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map(({ icon: Icon, label, path }) => (
              <Link
                key={path}
                to={path}
                className={`flex items-center space-x-1 p-2 rounded-lg transition-colors ${
                  isActive(path)
                    ? 'text-snapzy-primary bg-snapzy-primary bg-opacity-10'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Icon className="h-6 w-6" />
                <span className="hidden lg:block">{label}</span>
              </Link>
            ))}

            {/* User Menu */}
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <img
                  src={user.profilePicture}
                  alt={user.username}
                  className="h-8 w-8 rounded-full object-cover"
                />
                <span className="hidden lg:block text-gray-700">{user.username}</span>
              </button>

              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2">
                  <Link
                    to={`/profile/${user.id}`}
                    className="flex items-center space-x-2 px-4 py-2 text-gray-700 hover:bg-gray-100"
                    onClick={() => setShowUserMenu(false)}
                  >
                    <User className="h-4 w-4" />
                    <span>Profile</span>
                  </Link>
                  <Link
                    to="/settings"
                    className="flex items-center space-x-2 px-4 py-2 text-gray-700 hover:bg-gray-100"
                    onClick={() => setShowUserMenu(false)}
                  >
                    <Settings className="h-4 w-4" />
                    <span>Settings</span>
                  </Link>
                  <hr className="my-2" />
                  <button
                    onClick={handleLogout}
                    className="flex items-center space-x-2 px-4 py-2 text-red-600 hover:bg-red-50 w-full text-left"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Logout</span>
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Mobile Navigation */}
          <div className="md:hidden flex items-center space-x-4">
            <Link
              to="/upload"
              className="p-2 rounded-lg text-snapzy-primary hover:bg-snapzy-primary hover:bg-opacity-10 transition-colors"
            >
              <PlusSquare className="h-6 w-6" />
            </Link>
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <img
                src={user.profilePicture}
                alt={user.username}
                className="h-8 w-8 rounded-full object-cover"
              />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Bottom Navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50">
        <div className="flex justify-around py-2">
          {navItems.slice(0, 4).map(({ icon: Icon, path }) => (
            <Link
              key={path}
              to={path}
              className={`p-3 rounded-lg transition-colors ${
                isActive(path)
                  ? 'text-snapzy-primary'
                  : 'text-gray-600'
              }`}
            >
              <Icon className="h-6 w-6" />
            </Link>
          ))}
          <Link
            to={`/profile/${user.id}`}
            className={`p-3 rounded-lg transition-colors ${
              location.pathname.includes('/profile/')
                ? 'text-snapzy-primary'
                : 'text-gray-600'
            }`}
          >
            <User className="h-6 w-6" />
          </Link>
        </div>
      </div>

      {/* Mobile User Menu Overlay */}
      {showUserMenu && (
        <div className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-40" onClick={() => setShowUserMenu(false)}>
          <div className="absolute bottom-16 right-4 bg-white rounded-lg shadow-lg border border-gray-200 py-2 w-48">
            <Link
              to={`/profile/${user.id}`}
              className="flex items-center space-x-2 px-4 py-2 text-gray-700 hover:bg-gray-100"
              onClick={() => setShowUserMenu(false)}
            >
              <User className="h-4 w-4" />
              <span>Profile</span>
            </Link>
            <Link
              to="/settings"
              className="flex items-center space-x-2 px-4 py-2 text-gray-700 hover:bg-gray-100"
              onClick={() => setShowUserMenu(false)}
            >
              <Settings className="h-4 w-4" />
              <span>Settings</span>
            </Link>
            <hr className="my-2" />
            <button
              onClick={handleLogout}
              className="flex items-center space-x-2 px-4 py-2 text-red-600 hover:bg-red-50 w-full text-left"
            >
              <LogOut className="h-4 w-4" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;