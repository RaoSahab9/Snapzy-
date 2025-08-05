import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  Heart, 
  MessageCircle, 
  Share, 
  MoreHorizontal,
  Heart as HeartFilled
} from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';

const PostCard = ({ post, onUpdate }) => {
  const { user } = useAuth();
  const [isLiked, setIsLiked] = useState(post.likes?.includes(user?._id) || false);
  const [likesCount, setLikesCount] = useState(post.likes?.length || 0);
  const [showComments, setShowComments] = useState(false);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleLike = async () => {
    try {
      const res = await axios.post(`/api/posts/${post._id}/like`);
      setIsLiked(res.data.liked);
      setLikesCount(prev => res.data.liked ? prev + 1 : prev - 1);
    } catch (error) {
      toast.error('Failed to like post');
    }
  };

  const handleComment = async (e) => {
    e.preventDefault();
    if (!comment.trim() || isSubmitting) return;

    setIsSubmitting(true);
    try {
      const res = await axios.post(`/api/posts/${post._id}/comments`, {
        text: comment
      });
      setComment('');
      if (onUpdate) {
        onUpdate(res.data);
      }
      toast.success('Comment added successfully!');
    } catch (error) {
      toast.error('Failed to add comment');
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatDate = (date) => {
    const now = new Date();
    const postDate = new Date(date);
    const diffInHours = Math.floor((now - postDate) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInHours < 168) return `${Math.floor(diffInHours / 24)}d ago`;
    return postDate.toLocaleDateString();
  };

  return (
    <div className="post-card mb-6">
      {/* Post Header */}
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center space-x-3">
          <Link to={`/profile/${post.user._id}`}>
            <img
              src={post.user.profilePicture || 'https://via.placeholder.com/40'}
              alt={post.user.username}
              className="profile-picture"
            />
          </Link>
          <div>
            <Link 
              to={`/profile/${post.user._id}`}
              className="font-semibold text-gray-900 hover:text-primary-600"
            >
              {post.user.username}
            </Link>
            {post.location && (
              <p className="text-sm text-gray-500">{post.location}</p>
            )}
          </div>
        </div>
        
        <button className="p-1 hover:bg-gray-100 rounded-full">
          <MoreHorizontal className="h-5 w-5 text-gray-600" />
        </button>
      </div>

      {/* Post Image */}
      <div className="relative">
        <img
          src={post.image}
          alt="Post"
          className="w-full h-auto max-h-96 object-cover"
        />
      </div>

      {/* Post Actions */}
      <div className="p-4">
        <div className="flex items-center space-x-4 mb-3">
          <button
            onClick={handleLike}
            className={`flex items-center space-x-1 transition-colors ${
              isLiked ? 'text-red-500' : 'text-gray-600 hover:text-red-500'
            }`}
          >
            {isLiked ? (
              <HeartFilled className="h-6 w-6 fill-current" />
            ) : (
              <Heart className="h-6 w-6" />
            )}
            <span className="text-sm font-medium">{likesCount}</span>
          </button>

          <button
            onClick={() => setShowComments(!showComments)}
            className="flex items-center space-x-1 text-gray-600 hover:text-gray-800 transition-colors"
          >
            <MessageCircle className="h-6 w-6" />
            <span className="text-sm font-medium">{post.comments?.length || 0}</span>
          </button>

          <button className="flex items-center space-x-1 text-gray-600 hover:text-gray-800 transition-colors">
            <Share className="h-6 w-6" />
          </button>
        </div>

        {/* Caption */}
        {post.caption && (
          <div className="mb-3">
            <span className="font-semibold text-gray-900">{post.user.username}</span>
            <span className="text-gray-900 ml-2">{post.caption}</span>
          </div>
        )}

        {/* Tags */}
        {post.tags && post.tags.length > 0 && (
          <div className="mb-3">
            {post.tags.map((tag, index) => (
              <span
                key={index}
                className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded mr-2 mb-1"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* Timestamp */}
        <p className="text-xs text-gray-500 mb-3">
          {formatDate(post.createdAt)}
        </p>

        {/* Comments Section */}
        {showComments && (
          <div className="border-t border-gray-200 pt-3">
            {/* Comment Input */}
            <form onSubmit={handleComment} className="flex space-x-2 mb-3">
              <input
                type="text"
                placeholder="Add a comment..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="flex-1 input text-sm"
                disabled={isSubmitting}
              />
              <button
                type="submit"
                disabled={!comment.trim() || isSubmitting}
                className="btn-primary text-sm px-3 py-1 disabled:opacity-50"
              >
                Post
              </button>
            </form>

            {/* Comments List */}
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {post.comments?.map((comment, index) => (
                <div key={index} className="flex items-start space-x-2">
                  <img
                    src={comment.userProfilePicture || 'https://via.placeholder.com/24'}
                    alt={comment.username}
                    className="w-6 h-6 rounded-full"
                  />
                  <div className="flex-1">
                    <span className="font-semibold text-sm">{comment.username}</span>
                    <span className="text-sm text-gray-900 ml-2">{comment.text}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PostCard;