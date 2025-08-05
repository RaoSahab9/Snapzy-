import React, { useState } from 'react';
import { Send, X, MoreHorizontal } from 'lucide-react';
import { Comment } from '../types';
import { useAuth } from '../context/AuthContext';
import { usePost } from '../context/PostContext';

interface CommentBoxProps {
  postId: string;
  comments: Comment[];
  onClose: () => void;
}

const CommentBox: React.FC<CommentBoxProps> = ({ postId, comments, onClose }) => {
  const { user } = useAuth();
  const { addComment, deleteComment } = usePost();
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || loading) return;

    try {
      setLoading(true);
      await addComment(postId, newComment.trim());
      setNewComment('');
    } catch (error) {
      console.error('Failed to add comment:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    if (window.confirm('Are you sure you want to delete this comment?')) {
      try {
        await deleteComment(postId, commentId);
      } catch (error) {
        console.error('Failed to delete comment:', error);
      }
    }
  };

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

  return (
    <div className="border-t border-gray-200 bg-gray-50">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <h3 className="font-semibold text-gray-900">Comments</h3>
        <button
          onClick={onClose}
          className="p-2 hover:bg-gray-200 rounded-full transition-colors"
        >
          <X className="h-5 w-5 text-gray-500" />
        </button>
      </div>

      {/* Comments List */}
      <div className="max-h-64 overflow-y-auto px-4 py-2">
        {comments.length === 0 ? (
          <p className="text-gray-500 text-center py-4">No comments yet</p>
        ) : (
          <div className="space-y-3">
            {comments.map((comment) => {
              const isOwnComment = user?.id === comment.user.id;
              
              return (
                <div key={comment._id} className="flex items-start space-x-3">
                  <img
                    src={comment.user.profilePicture}
                    alt={comment.user.username}
                    className="h-8 w-8 rounded-full object-cover flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2">
                      <span className="font-semibold text-gray-900 text-sm">
                        {comment.user.username}
                      </span>
                      <span className="text-gray-500 text-xs">
                        {formatTimeAgo(comment.createdAt)}
                      </span>
                    </div>
                    <p className="text-gray-900 text-sm mt-1">{comment.text}</p>
                  </div>
                  
                  {isOwnComment && (
                    <div className="relative">
                      <button
                        onClick={() => handleDeleteComment(comment._id)}
                        className="p-1 hover:bg-gray-200 rounded-full transition-colors"
                      >
                        <MoreHorizontal className="h-4 w-4 text-gray-500" />
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Add Comment Form */}
      <form onSubmit={handleSubmitComment} className="p-4 border-t border-gray-200">
        <div className="flex items-center space-x-3">
          <img
            src={user?.profilePicture}
            alt={user?.username}
            className="h-8 w-8 rounded-full object-cover flex-shrink-0"
          />
          <div className="flex-1 relative">
            <input
              type="text"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Add a comment..."
              className="w-full py-2 px-3 pr-12 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-snapzy-primary focus:border-transparent"
              maxLength={300}
              disabled={loading}
            />
            <button
              type="submit"
              disabled={!newComment.trim() || loading}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1 text-snapzy-primary disabled:text-gray-400 hover:bg-snapzy-primary hover:bg-opacity-10 rounded-full transition-colors"
            >
              <Send className="h-4 w-4" />
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default CommentBox;