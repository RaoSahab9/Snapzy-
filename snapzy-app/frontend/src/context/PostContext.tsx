import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { Post, PostContextType, CreatePostData } from '../types';
import { postAPI } from '../utils/api';

interface PostState {
  posts: Post[];
  loading: boolean;
  error: string | null;
}

type PostAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_POSTS'; payload: Post[] }
  | { type: 'ADD_POST'; payload: Post }
  | { type: 'UPDATE_POST'; payload: Post }
  | { type: 'DELETE_POST'; payload: string }
  | { type: 'TOGGLE_LIKE'; payload: { postId: string; isLiked: boolean; likeCount: number } }
  | { type: 'ADD_COMMENT'; payload: { postId: string; comment: any } }
  | { type: 'DELETE_COMMENT'; payload: { postId: string; commentId: string } };

const initialState: PostState = {
  posts: [],
  loading: false,
  error: null,
};

const postReducer = (state: PostState, action: PostAction): PostState => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false };
    case 'SET_POSTS':
      return { ...state, posts: action.payload, loading: false, error: null };
    case 'ADD_POST':
      return { ...state, posts: [action.payload, ...state.posts] };
    case 'UPDATE_POST':
      return {
        ...state,
        posts: state.posts.map(post =>
          post._id === action.payload._id ? action.payload : post
        ),
      };
    case 'DELETE_POST':
      return {
        ...state,
        posts: state.posts.filter(post => post._id !== action.payload),
      };
    case 'TOGGLE_LIKE':
      return {
        ...state,
        posts: state.posts.map(post =>
          post._id === action.payload.postId
            ? {
                ...post,
                isLiked: action.payload.isLiked,
                likeCount: action.payload.likeCount,
              }
            : post
        ),
      };
    case 'ADD_COMMENT':
      return {
        ...state,
        posts: state.posts.map(post =>
          post._id === action.payload.postId
            ? {
                ...post,
                comments: [...post.comments, action.payload.comment],
                commentCount: post.commentCount + 1,
              }
            : post
        ),
      };
    case 'DELETE_COMMENT':
      return {
        ...state,
        posts: state.posts.map(post =>
          post._id === action.payload.postId
            ? {
                ...post,
                comments: post.comments.filter(
                  comment => comment._id !== action.payload.commentId
                ),
                commentCount: post.commentCount - 1,
              }
            : post
        ),
      };
    default:
      return state;
  }
};

const PostContext = createContext<PostContextType | null>(null);

export const usePost = (): PostContextType => {
  const context = useContext(PostContext);
  if (!context) {
    throw new Error('usePost must be used within a PostProvider');
  }
  return context;
};

interface PostProviderProps {
  children: ReactNode;
}

export const PostProvider: React.FC<PostProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(postReducer, initialState);

  const fetchFeed = async (): Promise<void> => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const response = await postAPI.getFeed();
      dispatch({ type: 'SET_POSTS', payload: response.posts || [] });
    } catch (error: any) {
      dispatch({ type: 'SET_ERROR', payload: error.response?.data?.message || 'Failed to fetch feed' });
    }
  };

  const fetchUserPosts = async (userId: string): Promise<void> => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const response = await postAPI.getUserPosts(userId);
      dispatch({ type: 'SET_POSTS', payload: response.posts || [] });
    } catch (error: any) {
      dispatch({ type: 'SET_ERROR', payload: error.response?.data?.message || 'Failed to fetch user posts' });
    }
  };

  const createPost = async (data: CreatePostData): Promise<void> => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const response = await postAPI.createPost(data);
      dispatch({ type: 'ADD_POST', payload: response.post! });
      dispatch({ type: 'SET_LOADING', payload: false });
    } catch (error: any) {
      dispatch({ type: 'SET_ERROR', payload: error.response?.data?.message || 'Failed to create post' });
      throw error;
    }
  };

  const deletePost = async (postId: string): Promise<void> => {
    try {
      await postAPI.deletePost(postId);
      dispatch({ type: 'DELETE_POST', payload: postId });
    } catch (error: any) {
      dispatch({ type: 'SET_ERROR', payload: error.response?.data?.message || 'Failed to delete post' });
      throw error;
    }
  };

  const toggleLike = async (postId: string): Promise<void> => {
    try {
      const response = await postAPI.toggleLike(postId);
      dispatch({
        type: 'TOGGLE_LIKE',
        payload: {
          postId,
          isLiked: response.isLiked!,
          likeCount: response.likeCount!,
        },
      });
    } catch (error: any) {
      dispatch({ type: 'SET_ERROR', payload: error.response?.data?.message || 'Failed to toggle like' });
    }
  };

  const addComment = async (postId: string, text: string): Promise<void> => {
    try {
      const response = await postAPI.addComment(postId, text);
      dispatch({
        type: 'ADD_COMMENT',
        payload: { postId, comment: response.comment },
      });
    } catch (error: any) {
      dispatch({ type: 'SET_ERROR', payload: error.response?.data?.message || 'Failed to add comment' });
      throw error;
    }
  };

  const deleteComment = async (postId: string, commentId: string): Promise<void> => {
    try {
      await postAPI.deleteComment(postId, commentId);
      dispatch({
        type: 'DELETE_COMMENT',
        payload: { postId, commentId },
      });
    } catch (error: any) {
      dispatch({ type: 'SET_ERROR', payload: error.response?.data?.message || 'Failed to delete comment' });
      throw error;
    }
  };

  const value: PostContextType = {
    posts: state.posts,
    loading: state.loading,
    error: state.error,
    fetchFeed,
    fetchUserPosts,
    createPost,
    deletePost,
    toggleLike,
    addComment,
    deleteComment,
  };

  return <PostContext.Provider value={value}>{children}</PostContext.Provider>;
};