const express = require('express');
const {
  getUserProfile,
  updateProfile,
  toggleFollow,
  getFollowers,
  getFollowing,
  searchUsers
} = require('../controllers/userController');
const auth = require('../middleware/auth');
const { upload } = require('../utils/cloudinary');

const router = express.Router();

// @route   GET /api/users/search
// @desc    Search users
// @access  Private
router.get('/search', auth, searchUsers);

// @route   GET /api/users/:id
// @desc    Get user profile
// @access  Public
router.get('/:id', getUserProfile);

// @route   PUT /api/users/profile
// @desc    Update user profile
// @access  Private
router.put('/profile', auth, updateProfile);

// @route   POST /api/users/:id/follow
// @desc    Follow/Unfollow user
// @access  Private
router.post('/:id/follow', auth, toggleFollow);

// @route   GET /api/users/:id/followers
// @desc    Get user followers
// @access  Public
router.get('/:id/followers', getFollowers);

// @route   GET /api/users/:id/following
// @desc    Get user following
// @access  Public
router.get('/:id/following', getFollowing);

module.exports = router;