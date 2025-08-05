const Post = require('../models/Post');
const User = require('../models/User');
const { uploadImage, deleteImage } = require('../utils/cloudinary');

// @desc    Get all posts (feed)
// @route   GET /api/posts
// @access  Private
const getPosts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Get posts from users that the current user follows
    const currentUser = await User.findById(req.user._id);
    const followingIds = [...currentUser.following, req.user._id];

    const posts = await Post.find({ user: { $in: followingIds } })
      .populate('user', 'username profilePicture fullName')
      .populate('comments.user', 'username profilePicture')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Post.countDocuments({ user: { $in: followingIds } });

    res.json({
      posts,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      hasNext: page * limit < total,
      hasPrev: page > 1
    });
  } catch (error) {
    console.error('Get posts error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Create new post
// @route   POST /api/posts
// @access  Private
const createPost = async (req, res) => {
  try {
    const { caption, location, tags } = req.body;
    const { image } = req.body;

    if (!image) {
      return res.status(400).json({ message: 'Image is required' });
    }

    // Upload image to Cloudinary
    let imageUrl;
    try {
      const result = await uploadImage(image);
      imageUrl = result.url;
    } catch (error) {
      return res.status(400).json({ message: 'Image upload failed' });
    }

    // Create post
    const post = await Post.create({
      user: req.user._id,
      image: imageUrl,
      caption,
      location,
      tags: tags ? tags.split(',').map(tag => tag.trim()) : []
    });

    // Populate user data
    await post.populate('user', 'username profilePicture fullName');

    res.status(201).json(post);
  } catch (error) {
    console.error('Create post error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get single post
// @route   GET /api/posts/:id
// @access  Public
const getPost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
      .populate('user', 'username profilePicture fullName')
      .populate('comments.user', 'username profilePicture');

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    res.json(post);
  } catch (error) {
    console.error('Get post error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Update post
// @route   PUT /api/posts/:id
// @access  Private
const updatePost = async (req, res) => {
  try {
    const { caption, location, tags } = req.body;

    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    // Check if user owns the post
    if (post.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const updatedPost = await Post.findByIdAndUpdate(
      req.params.id,
      {
        caption,
        location,
        tags: tags ? tags.split(',').map(tag => tag.trim()) : []
      },
      { new: true, runValidators: true }
    )
    .populate('user', 'username profilePicture fullName')
    .populate('comments.user', 'username profilePicture');

    res.json(updatedPost);
  } catch (error) {
    console.error('Update post error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Delete post
// @route   DELETE /api/posts/:id
// @access  Private
const deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    // Check if user owns the post
    if (post.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    // Delete image from Cloudinary if it's a Cloudinary URL
    if (post.image.includes('cloudinary')) {
      try {
        const publicId = post.image.split('/').pop().split('.')[0];
        await deleteImage(publicId);
      } catch (error) {
        console.error('Cloudinary delete error:', error);
      }
    }

    await Post.findByIdAndDelete(req.params.id);

    res.json({ message: 'Post deleted successfully' });
  } catch (error) {
    console.error('Delete post error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Like/Unlike post
// @route   POST /api/posts/:id/like
// @access  Private
const likePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    const isLiked = post.isLikedBy(req.user._id);

    if (isLiked) {
      await post.removeLike(req.user._id);
      res.json({ message: 'Post unliked', liked: false });
    } else {
      await post.addLike(req.user._id);
      res.json({ message: 'Post liked', liked: true });
    }
  } catch (error) {
    console.error('Like post error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Add comment to post
// @route   POST /api/posts/:id/comments
// @access  Private
const addComment = async (req, res) => {
  try {
    const { text } = req.body;

    if (!text || text.trim().length === 0) {
      return res.status(400).json({ message: 'Comment text is required' });
    }

    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    const user = await User.findById(req.user._id);

    await post.addComment(
      req.user._id,
      text.trim(),
      user.username,
      user.profilePicture
    );

    // Populate the new comment
    await post.populate('comments.user', 'username profilePicture');

    res.json(post);
  } catch (error) {
    console.error('Add comment error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get user's posts
// @route   GET /api/posts/user/:userId
// @access  Public
const getUserPosts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const posts = await Post.find({ user: req.params.userId })
      .populate('user', 'username profilePicture fullName')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Post.countDocuments({ user: req.params.userId });

    res.json({
      posts,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      hasNext: page * limit < total,
      hasPrev: page > 1
    });
  } catch (error) {
    console.error('Get user posts error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getPosts,
  createPost,
  getPost,
  updatePost,
  deletePost,
  likePost,
  addComment,
  getUserPosts
};