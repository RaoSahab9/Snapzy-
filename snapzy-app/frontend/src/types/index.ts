export interface User {
  id: string;
  username: string;
  email: string;
  fullName?: string;
  profilePicture: string;
  bio?: string;
  followers: User[];
  following: User[];
  followerCount: number;
  followingCount: number;
  postCount?: number;
  isPrivate: boolean;
  isFollowing?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Post {
  _id: string;
  user: User;
  image: string;
  caption?: string;
  location?: string;
  likes: string[];
  comments: Comment[];
  hashtags: string[];
  likeCount: number;
  commentCount: number;
  isLiked: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Comment {
  _id: string;
  user: User;
  text: string;
  createdAt: string;
}

export interface AuthResponse {
  message: string;
  token: string;
  user: User;
}

export interface ApiResponse<T = any> {
  message: string;
  data?: T;
  user?: User;
  post?: Post;
  posts?: Post[];
  users?: User[];
  followers?: User[];
  following?: User[];
  comment?: Comment;
  errors?: string[];
}

export interface LoginFormData {
  email: string;
  password: string;
}

export interface RegisterFormData {
  username: string;
  email: string;
  password: string;
  fullName: string;
}

export interface CreatePostData {
  image: File;
  caption?: string;
  location?: string;
}

export interface UpdateProfileData {
  fullName?: string;
  bio?: string;
  isPrivate?: boolean;
}

export interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: RegisterFormData) => Promise<void>;
  logout: () => void;
  updateUser: (user: User) => void;
}

export interface PostContextType {
  posts: Post[];
  loading: boolean;
  error: string | null;
  fetchFeed: () => Promise<void>;
  fetchUserPosts: (userId: string) => Promise<void>;
  createPost: (data: CreatePostData) => Promise<void>;
  deletePost: (postId: string) => Promise<void>;
  toggleLike: (postId: string) => Promise<void>;
  addComment: (postId: string, text: string) => Promise<void>;
  deleteComment: (postId: string, commentId: string) => Promise<void>;
}