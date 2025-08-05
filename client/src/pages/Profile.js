import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Loader2, UserPlus, UserMinus, Settings } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';
import PostCard from '../components/PostCard';

const Profile = () => {
  const { userId } = useParams();
  const { user: currentUser } = useAuth();
  const [profile, setProfile] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isFollowing, setIsFollowing] = useState(false);
  const [followersCount, setFollowersCount] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);
  const [activeTab, setActiveTab] = useState('posts');

  useEffect(() => {
    fetchProfile();
  }, [userId]);

  const fetchProfile = async () => {
    try {
      const response = await axios.get(`/api/users/${userId}`);
      const { user, posts } = response.data;
      
      setProfile(user);
      setPosts(posts);
      setIsFollowing(user.followers?.includes(currentUser?._id) || false);
      setFollowersCount(user.followers?.length || 0);
      setFollowingCount(user.following?.length || 0);
    } catch (error) {
      console.error('Error fetching profile:', error);
      toast.error('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const handleFollow = async () => {
    try {
      if (isFollowing) {
        await axios.delete(`/api/users/${userId}/follow`);
        setFollowersCount(prev => prev - 1);
        toast.success('Unfollowed successfully');
      } else {
        await axios.post(`/api/users/${userId}/follow`);
        setFollowersCount(prev => prev + 1);
        toast.success('Followed successfully');
      }
      setIsFollowing(!isFollowing);
    } catch (error) {
      console.error('Follow error:', error);
      toast.error('Failed to update follow status');
    }
  };

  const handlePostUpdate = (updatedPost) => {
    setPosts(prev => 
      prev.map(post => 
        post._id === updatedPost._id ? updatedPost : post
      )
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">User not found</h2>
        <p className="text-gray-600">The user you're looking for doesn't exist.</p>
      </div>
    );
  }

  const isOwnProfile = currentUser?._id === userId;

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      {/* Profile Header */}
      <div className="card p-6 mb-6">
        <div className="flex items-start space-x-6">
          <img
            src={profile.profilePicture || 'https://via.placeholder.com/150'}
            alt={profile.username}
            className="profile-picture-xl"
          />
          
          <div className="flex-1">
            <div className="flex items-center space-x-4 mb-4">
              <h1 className="text-2xl font-bold text-gray-900">{profile.username}</h1>
              
              {!isOwnProfile && (
                <button
                  onClick={handleFollow}
                  className={`btn flex items-center space-x-2 ${
                    isFollowing ? 'btn-outline' : 'btn-primary'
                  }`}
                >
                  {isFollowing ? (
                    <>
                      <UserMinus className="h-4 w-4" />
                      <span>Unfollow</span>
                    </>
                  ) : (
                    <>
                      <UserPlus className="h-4 w-4" />
                      <span>Follow</span>
                    </>
                  )}
                </button>
              )}
              
              {isOwnProfile && (
                <button className="btn-outline flex items-center space-x-2">
                  <Settings className="h-4 w-4" />
                  <span>Edit Profile</span>
                </button>
              )}
            </div>
            
            <div className="flex space-x-8 mb-4">
              <div>
                <span className="font-semibold">{posts.length}</span>
                <span className="text-gray-600 ml-1">posts</span>
              </div>
              <div>
                <span className="font-semibold">{followersCount}</span>
                <span className="text-gray-600 ml-1">followers</span>
              </div>
              <div>
                <span className="font-semibold">{followingCount}</span>
                <span className="text-gray-600 ml-1">following</span>
              </div>
            </div>
            
            <div>
              <h2 className="font-semibold text-gray-900">{profile.fullName}</h2>
              {profile.bio && (
                <p className="text-gray-600 mt-1">{profile.bio}</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="flex space-x-8">
          <button
            onClick={() => setActiveTab('posts')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'posts'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Posts
          </button>
          <button
            onClick={() => setActiveTab('followers')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'followers'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Followers
          </button>
          <button
            onClick={() => setActiveTab('following')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'following'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Following
          </button>
        </nav>
      </div>

      {/* Content */}
      {activeTab === 'posts' && (
        <div className="space-y-6">
          {posts.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">
                <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No posts yet</h3>
              <p className="text-gray-600">
                {isOwnProfile ? 'Share your first post!' : 'This user hasn\'t posted anything yet.'}
              </p>
            </div>
          ) : (
            posts.map((post) => (
              <PostCard
                key={post._id}
                post={post}
                onUpdate={handlePostUpdate}
              />
            ))
          )}
        </div>
      )}

      {activeTab === 'followers' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {profile.followers?.map((follower) => (
            <div key={follower._id} className="card p-4">
              <div className="flex items-center space-x-3">
                <img
                  src={follower.profilePicture || 'https://via.placeholder.com/40'}
                  alt={follower.username}
                  className="profile-picture"
                />
                <div>
                  <h3 className="font-semibold text-gray-900">{follower.username}</h3>
                  <p className="text-sm text-gray-600">{follower.fullName}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'following' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {profile.following?.map((following) => (
            <div key={following._id} className="card p-4">
              <div className="flex items-center space-x-3">
                <img
                  src={following.profilePicture || 'https://via.placeholder.com/40'}
                  alt={following.username}
                  className="profile-picture"
                />
                <div>
                  <h3 className="font-semibold text-gray-900">{following.username}</h3>
                  <p className="text-sm text-gray-600">{following.fullName}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Profile;