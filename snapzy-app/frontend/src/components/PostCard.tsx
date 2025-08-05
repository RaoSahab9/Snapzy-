import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, MessageCircle, Share2, Bookmark, MoreHorizontal, MapPin } from 'lucide-react';
import { Post } from '../types';
import { useAuth } from '../context/AuthContext';
import { usePost } from '../context/PostContext';
import CommentBox from './CommentBox';
import LikeButton from './LikeButton';

interface PostCardProps {
  post: Post;
}

const PostCard: React.FC<PostCardProps> = ({ post }) => {
  const { user } = useAuth();
  const { deletePost } = usePost();
  const [showComments, setShowComments] = useState(false);
  const [showMore, setShowMore] = useState(false);
  const [showOptions, setShowOptions] = useState(false);

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return 'just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d`;
    return `${Math.floor(diffInSeconds / 604800)}w`;
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      try {
        await deletePost(post._id);
      } catch (error) {
        console.error('Failed to delete post:', error);
      }
    }
    setShowOptions(false);
  };

  const isOwnPost = user?.id === post.user.id;

  return (
    <article className="bg-white border border-gray-200 rounded-lg shadow-sm mb-6">
      {/* Post Header */}
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center space-x-3">
          <Link to={`/profile/${post.user.id}`}>
            <img
              src={post.user.profilePicture}
              alt={post.user.username}
              className="h-10 w-10 rounded-full object-cover"
            />
          </Link>
          <div>
            <Link 
              to={`/profile/${post.user.id}`}
              className="font-semibold text-gray-900 hover:text-snapzy-primary transition-colors"
            >
              {post.user.username}
            </Link>
            {post.location && (
              <div className="flex items-center space-x-1 text-gray-500 text-sm">
                <MapPin className="h-3 w-3" />
                <span>{post.location}</span>
              </div>
            )}
          </div>
        </div>
        
        <div className="relative">
          <button
            onClick={() => setShowOptions(!showOptions)}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <MoreHorizontal className="h-5 w-5 text-gray-500" />
          </button>
          
          {showOptions && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-10">
              {isOwnPost && (
                <button
                  onClick={handleDelete}
                  className="block w-full text-left px-4 py-2 text-red-600 hover:bg-red-50"
                >
                  Delete Post
                </button>
              )}
              <button
                onClick={() => setShowOptions(false)}
                className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
              >
                Report
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Post Image */}
      <div className="relative">
        <img
          src={post.image}
          alt={post.caption || 'Post'}
          className="w-full h-auto max-h-[600px] object-cover"
        />
      </div>

      {/* Post Actions */}
      <div className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-4">
            <LikeButton postId={post._id} isLiked={post.isLiked} />
            <button
              onClick={() => setShowComments(!showComments)}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <MessageCircle className="h-6 w-6 text-gray-700" />
            </button>
            <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
              <Share2 className="h-6 w-6 text-gray-700" />
            </button>
          </div>
          <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <Bookmark className="h-6 w-6 text-gray-700" />
          </button>
        </div>

        {/* Like Count */}
        {post.likeCount > 0 && (
          <p className="font-semibold text-gray-900 mb-2">
            {post.likeCount} {post.likeCount === 1 ? 'like' : 'likes'}
          </p>
        )}

        {/* Caption */}
        {post.caption && (
          <div className="mb-2">
            <span className="font-semibold text-gray-900 mr-2">{post.user.username}</span>
            <span className="text-gray-900">
              {showMore || post.caption.length <= 100 
                ? post.caption 
                : `${post.caption.substring(0, 100)}...`
              }
              {post.caption.length > 100 && (
                <button
                  onClick={() => setShowMore(!showMore)}
                  className="text-gray-500 ml-1"
                >
                  {showMore ? 'less' : 'more'}
                </button>
              )}
            </span>
          </div>
        )}

        {/* Hashtags */}
        {post.hashtags && post.hashtags.length > 0 && (
          <div className="mb-2">
            {post.hashtags.map((hashtag, index) => (
              <span key={index} className="text-snapzy-primary mr-1">
                #{hashtag}
              </span>
            ))}
          </div>
        )}

        {/* Comments Count */}
        {post.commentCount > 0 && (
          <button
            onClick={() => setShowComments(!showComments)}
            className="text-gray-500 text-sm hover:text-gray-700 transition-colors mb-2"
          >
            View all {post.commentCount} comments
          </button>
        )}

        {/* Recent Comments */}
        {post.comments.slice(-2).map((comment) => (
          <div key={comment._id} className="mb-1">
            <span className="font-semibold text-gray-900 mr-2">{comment.user.username}</span>
            <span className="text-gray-900">{comment.text}</span>
          </div>
        ))}

        {/* Timestamp */}
        <p className="text-gray-500 text-xs uppercase tracking-wide mt-2">
          {formatTimeAgo(post.createdAt)}
        </p>
      </div>

      {/* Comments Section */}
      {showComments && (
        <CommentBox
          postId={post._id}
          comments={post.comments}
          onClose={() => setShowComments(false)}
        />
      )}
    </article>
  );
};

export default PostCard;