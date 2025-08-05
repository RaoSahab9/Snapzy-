import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Settings, Grid, Heart, MessageCircle, MoreHorizontal } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { usePost } from '../context/PostContext';
import { userAPI } from '../utils/api';
import { User, Post } from '../types';
import Navbar from '../components/Navbar';

const Profile: React.FC = () => {
  const { userId } = useParams<{ userId: string }>();
  const { user: currentUser } = useAuth();
  const { fetchUserPosts } = usePost();
  
  const [profileUser, setProfileUser] = useState<User | null>(null);
  const [userPosts, setUserPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isFollowing, setIsFollowing] = useState(false);
  const [followersCount, setFollowersCount] = useState(0);

  const isOwnProfile = currentUser?.id === userId;

  useEffect(() => {
    const fetchProfileData = async () => {
      if (!userId) return;

      try {
        setLoading(true);
        
        // Fetch user profile
        const userResponse = await userAPI.getUserProfile(userId);
        setProfileUser(userResponse.user!);
        setIsFollowing(userResponse.user!.isFollowing || false);
        setFollowersCount(userResponse.user!.followerCount);

        // Fetch user posts
        const postsResponse = await userAPI.getUserProfile(userId);
        // For now, we'll just set empty posts since we don't have the posts endpoint returning posts
        setUserPosts([]);
        
      } catch (error: any) {
        setError(error.response?.data?.message || 'Failed to load profile');
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, [userId]);

  const handleFollowToggle = async () => {
    if (!userId || !profileUser) return;

    try {
      const response = await userAPI.toggleFollow(userId);
      setIsFollowing(response.isFollowing!);
      setFollowersCount(prev => response.isFollowing ? prev + 1 : prev - 1);
    } catch (error) {
      console.error('Failed to toggle follow:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <main className="max-w-4xl mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="flex items-center space-x-8 mb-8">
              <div className="h-32 w-32 bg-gray-200 rounded-full"></div>
              <div className="flex-1">
                <div className="h-8 bg-gray-200 rounded w-48 mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-32 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-64"></div>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-1 md:gap-4">
              {[...Array(9)].map((_, index) => (
                <div key={index} className="aspect-square bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <main className="max-w-4xl mx-auto px-4 py-8">
          <div className="text-center py-12">
            <p className="text-red-600 mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="btn-primary"
            >
              Try again
            </button>
          </div>
        </main>
      </div>
    );
  }

  if (!profileUser) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="max-w-4xl mx-auto px-4 py-8 pb-20 md:pb-8">
        {/* Profile Header */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex flex-col md:flex-row items-center md:items-start space-y-6 md:space-y-0 md:space-x-8">
            {/* Profile Picture */}
            <div className="relative">
              <img
                src={profileUser.profilePicture}
                alt={profileUser.username}
                className="h-32 w-32 rounded-full object-cover border-4 border-white shadow-lg"
              />
              {isOwnProfile && (
                <button className="absolute bottom-0 right-0 p-2 bg-snapzy-primary text-white rounded-full shadow-lg hover:bg-snapzy-secondary transition-colors">
                  <Settings className="h-4 w-4" />
                </button>
              )}
            </div>

            {/* Profile Info */}
            <div className="flex-1 text-center md:text-left">
              <div className="flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0 md:space-x-6">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 mb-2">
                    {profileUser.username}
                  </h1>
                  {profileUser.fullName && (
                    <p className="text-gray-600 font-medium mb-2">
                      {profileUser.fullName}
                    </p>
                  )}
                  {profileUser.bio && (
                    <p className="text-gray-700 mb-4 max-w-md">
                      {profileUser.bio}
                    </p>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-3">
                  {isOwnProfile ? (
                    <>
                      <Link to="/settings" className="btn-secondary">
                        Edit Profile
                      </Link>
                      <button className="btn-secondary">
                        <Settings className="h-4 w-4" />
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={handleFollowToggle}
                        className={isFollowing ? 'btn-secondary' : 'btn-primary'}
                      >
                        {isFollowing ? 'Following' : 'Follow'}
                      </button>
                      <button className="btn-secondary">
                        Message
                      </button>
                      <button className="btn-secondary">
                        <MoreHorizontal className="h-4 w-4" />
                      </button>
                    </>
                  )}
                </div>
              </div>

              {/* Stats */}
              <div className="flex justify-center md:justify-start space-x-8 mt-6">
                <div className="text-center">
                  <p className="font-bold text-xl text-gray-900">
                    {profileUser.postCount || 0}
                  </p>
                  <p className="text-gray-600 text-sm">Posts</p>
                </div>
                <Link to={`/profile/${userId}/followers`} className="text-center hover:text-snapzy-primary transition-colors">
                  <p className="font-bold text-xl text-gray-900">
                    {followersCount}
                  </p>
                  <p className="text-gray-600 text-sm">Followers</p>
                </Link>
                <Link to={`/profile/${userId}/following`} className="text-center hover:text-snapzy-primary transition-colors">
                  <p className="font-bold text-xl text-gray-900">
                    {profileUser.followingCount}
                  </p>
                  <p className="text-gray-600 text-sm">Following</p>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Posts Grid */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="border-b border-gray-200 p-4">
            <div className="flex items-center justify-center space-x-8">
              <button className="flex items-center space-x-2 text-snapzy-primary border-b-2 border-snapzy-primary pb-3">
                <Grid className="h-4 w-4" />
                <span className="font-medium">Posts</span>
              </button>
              <button className="flex items-center space-x-2 text-gray-500 pb-3">
                <Heart className="h-4 w-4" />
                <span className="font-medium">Liked</span>
              </button>
            </div>
          </div>

          {/* Posts Grid Content */}
          <div className="p-6">
            {userPosts.length === 0 ? (
              <div className="text-center py-12">
                <Grid className="h-24 w-24 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {isOwnProfile ? 'Share your first photo' : 'No posts yet'}
                </h3>
                <p className="text-gray-600 mb-6">
                  {isOwnProfile 
                    ? 'When you share photos, they will appear on your profile.'
                    : `${profileUser.username} hasn't posted anything yet.`
                  }
                </p>
                {isOwnProfile && (
                  <Link to="/upload" className="btn-primary">
                    Share your first photo
                  </Link>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-3 gap-1 md:gap-4">
                {userPosts.map((post) => (
                  <div
                    key={post._id}
                    className="aspect-square bg-gray-100 rounded-lg overflow-hidden group cursor-pointer relative"
                  >
                    <img
                      src={post.image}
                      alt={post.caption || 'Post'}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-opacity duration-200 flex items-center justify-center">
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex space-x-4 text-white">
                        <div className="flex items-center space-x-1">
                          <Heart className="h-5 w-5 fill-current" />
                          <span className="font-semibold">{post.likeCount}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <MessageCircle className="h-5 w-5 fill-current" />
                          <span className="font-semibold">{post.commentCount}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Profile;