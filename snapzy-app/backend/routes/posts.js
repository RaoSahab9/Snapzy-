const express = require('express');
const {
  createPost,
  getFeed,
  getPost,
  getUserPosts,
  deletePost,
  toggleLike,
  addComment,
  deleteComment,
  getExplorePosts
} = require('../controllers/postController');
const auth = require('../middleware/auth');
const { upload } = require('../utils/cloudinary');

const router = express.Router();

// @route   POST /api/posts
// @desc    Create new post
// @access  Private
router.post('/', auth, upload.single('image'), createPost);

// @route   GET /api/posts/feed
// @desc    Get user's feed
// @access  Private
router.get('/feed', auth, getFeed);

// @route   GET /api/posts/explore
// @desc    Get explore posts
// @access  Private
router.get('/explore', auth, getExplorePosts);

// @route   GET /api/posts/user/:userId
// @desc    Get user's posts
// @access  Public
router.get('/user/:userId', getUserPosts);

// @route   GET /api/posts/:id
// @desc    Get single post
// @access  Public
router.get('/:id', getPost);

// @route   DELETE /api/posts/:id
// @desc    Delete post
// @access  Private
router.delete('/:id', auth, deletePost);

// @route   POST /api/posts/:id/like
// @desc    Toggle like on post
// @access  Private
router.post('/:id/like', auth, toggleLike);

// @route   POST /api/posts/:id/comments
// @desc    Add comment to post
// @access  Private
router.post('/:id/comments', auth, addComment);

// @route   DELETE /api/posts/:postId/comments/:commentId
// @desc    Delete comment
// @access  Private
router.delete('/:postId/comments/:commentId', auth, deleteComment);

module.exports = router;