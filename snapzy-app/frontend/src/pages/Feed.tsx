import React, { useEffect } from 'react';
import { usePost } from '../context/PostContext';
import { useAuth } from '../context/AuthContext';
import PostCard from '../components/PostCard';
import Navbar from '../components/Navbar';
import { RefreshCw, Camera } from 'lucide-react';

const Feed: React.FC = () => {
  const { posts, loading, error, fetchFeed } = usePost();
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchFeed();
    }
  }, [user]);

  const handleRefresh = () => {
    fetchFeed();
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="max-w-2xl mx-auto px-4 py-8 pb-20 md:pb-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Your Feed</h1>
          <button
            onClick={handleRefresh}
            disabled={loading}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`h-5 w-5 text-gray-600 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>

        {/* Loading State */}
        {loading && posts.length === 0 && (
          <div className="space-y-6">
            {[...Array(3)].map((_, index) => (
              <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200 animate-pulse">
                <div className="p-4 flex items-center space-x-3">
                  <div className="h-10 w-10 bg-gray-200 rounded-full"></div>
                  <div className="flex-1">
                    <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/6"></div>
                  </div>
                </div>
                <div className="h-64 bg-gray-200"></div>
                <div className="p-4">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-6">
            <p className="font-medium">Error loading feed</p>
            <p className="text-sm">{error}</p>
            <button
              onClick={handleRefresh}
              className="mt-2 text-sm text-red-800 hover:text-red-900 underline"
            >
              Try again
            </button>
          </div>
        )}

        {/* Empty State */}
        {!loading && posts.length === 0 && !error && (
          <div className="text-center py-12">
            <Camera className="h-24 w-24 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No posts yet</h3>
            <p className="text-gray-600 mb-6">
              Follow some users or create your first post to see content here.
            </p>
            <div className="space-y-3">
              <a
                href="/upload"
                className="btn-primary inline-block"
              >
                Create your first post
              </a>
              <br />
              <a
                href="/search"
                className="btn-secondary inline-block"
              >
                Find people to follow
              </a>
            </div>
          </div>
        )}

        {/* Posts */}
        {posts.length > 0 && (
          <div className="space-y-6">
            {posts.map((post) => (
              <PostCard key={post._id} post={post} />
            ))}
            
            {/* Load More Button */}
            {posts.length >= 10 && (
              <div className="text-center pt-6">
                <button
                  onClick={handleRefresh}
                  className="btn-secondary"
                  disabled={loading}
                >
                  {loading ? 'Loading...' : 'Load more posts'}
                </button>
              </div>
            )}
          </div>
        )}

        {/* Stories Section (Placeholder) */}
        {posts.length > 0 && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
            <h3 className="font-semibold text-gray-900 mb-3">Stories</h3>
            <div className="flex space-x-4 overflow-x-auto scrollbar-hide">
              <div className="flex-shrink-0 text-center">
                <div className="h-16 w-16 rounded-full bg-gradient-to-r from-snapzy-primary to-snapzy-pink p-1">
                  <img
                    src={user.profilePicture}
                    alt="Your story"
                    className="h-full w-full rounded-full object-cover bg-white p-1"
                  />
                </div>
                <p className="text-xs text-gray-600 mt-1">Your story</p>
              </div>
              {[...Array(5)].map((_, index) => (
                <div key={index} className="flex-shrink-0 text-center">
                  <div className="h-16 w-16 rounded-full bg-gray-200 animate-pulse"></div>
                  <p className="text-xs text-gray-400 mt-1">Story {index + 1}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Suggestions Section (Placeholder) */}
        {posts.length > 0 && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-gray-900">Suggestions for you</h3>
              <button className="text-sm text-snapzy-primary hover:text-snapzy-secondary">
                See all
              </button>
            </div>
            <div className="space-y-3">
              {[...Array(3)].map((_, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="h-10 w-10 rounded-full bg-gray-200 animate-pulse"></div>
                    <div>
                      <div className="h-4 bg-gray-200 rounded w-20 mb-1 animate-pulse"></div>
                      <div className="h-3 bg-gray-200 rounded w-16 animate-pulse"></div>
                    </div>
                  </div>
                  <button className="btn-secondary text-sm">Follow</button>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Feed;