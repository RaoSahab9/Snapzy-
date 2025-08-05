import React from 'react';
import { Heart } from 'lucide-react';
import { usePost } from '../context/PostContext';

interface LikeButtonProps {
  postId: string;
  isLiked: boolean;
}

const LikeButton: React.FC<LikeButtonProps> = ({ postId, isLiked }) => {
  const { toggleLike } = usePost();

  const handleToggleLike = async () => {
    try {
      await toggleLike(postId);
    } catch (error) {
      console.error('Failed to toggle like:', error);
    }
  };

  return (
    <button
      onClick={handleToggleLike}
      className="p-2 hover:bg-gray-100 rounded-full transition-all duration-200 active:scale-95"
    >
      <Heart
        className={`h-6 w-6 transition-all duration-200 ${
          isLiked
            ? 'text-red-500 fill-red-500 animate-bounce-gentle'
            : 'text-gray-700 hover:text-red-500'
        }`}
      />
    </button>
  );
};

export default LikeButton;