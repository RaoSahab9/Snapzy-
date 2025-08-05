import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  Home, 
  Plus, 
  Search, 
  User, 
  LogOut, 
  Settings,
  Camera
} from 'lucide-react';

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [showUserMenu, setShowUserMenu] = useState(false);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <nav className="fixed top-0 left-0 right-0 bg-white border-b border-gray-200 z-50">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <Camera className="h-8 w-8 text-primary-600" />
            <span className="text-xl font-bold text-gradient">Snapzy</span>
          </Link>

          {/* Search Bar */}
          <div className="flex-1 max-w-md mx-8">
            <form onSubmit={handleSearch} className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search users..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-gray-100 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </form>
          </div>

          {/* Navigation Icons */}
          <div className="flex items-center space-x-4">
            <Link
              to="/"
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <Home className="h-6 w-6 text-gray-600" />
            </Link>
            
            <Link
              to="/upload"
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <Plus className="h-6 w-6 text-gray-600" />
            </Link>

            {/* User Menu */}
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center space-x-2 p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <img
                  src={user?.profilePicture || 'https://via.placeholder.com/40'}
                  alt="Profile"
                  className="profile-picture"
                />
              </button>

              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                  <Link
                    to={`/profile/${user?._id}`}
                    className="flex items-center space-x-3 px-4 py-2 hover:bg-gray-50 transition-colors"
                    onClick={() => setShowUserMenu(false)}
                  >
                    <User className="h-4 w-4 text-gray-600" />
                    <span>Profile</span>
                  </Link>
                  
                  <Link
                    to="/settings"
                    className="flex items-center space-x-3 px-4 py-2 hover:bg-gray-50 transition-colors"
                    onClick={() => setShowUserMenu(false)}
                  >
                    <Settings className="h-4 w-4 text-gray-600" />
                    <span>Settings</span>
                  </Link>
                  
                  <hr className="my-2" />
                  
                  <button
                    onClick={handleLogout}
                    className="flex items-center space-x-3 px-4 py-2 hover:bg-gray-50 transition-colors w-full text-left"
                  >
                    <LogOut className="h-4 w-4 text-gray-600" />
                    <span>Logout</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Overlay to close menu when clicking outside */}
      {showUserMenu && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setShowUserMenu(false)}
        />
      )}
    </nav>
  );
};

export default Navbar;