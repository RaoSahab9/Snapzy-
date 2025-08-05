const express = require('express');
const { body } = require('express-validator');
const { protect, optionalAuth } = require('../middleware/auth');
const {
  getUserProfile,
  updateProfile,
  followUser,
  unfollowUser,
  searchUsers,
  getSuggestedUsers
} = require('../controllers/userController');

const router = express.Router();

// Validation middleware
const updateProfileValidation = [
  body('fullName')
    .optional()
    .isLength({ min: 1, max: 50 })
    .withMessage('Full name must be between 1 and 50 characters'),
  body('bio')
    .optional()
    .isLength({ max: 150 })
    .withMessage('Bio cannot exceed 150 characters'),
  body('username')
    .optional()
    .isLength({ min: 3, max: 30 })
    .withMessage('Username must be between 3 and 30 characters')
    .matches(/^[a-zA-Z0-9_]+$/)
    .withMessage('Username can only contain letters, numbers, and underscores')
];

// Routes
router.get('/search', searchUsers);
router.get('/suggested', protect, getSuggestedUsers);
router.get('/:id', optionalAuth, getUserProfile);
router.put('/:id', protect, updateProfileValidation, updateProfile);
router.post('/:id/follow', protect, followUser);
router.delete('/:id/follow', protect, unfollowUser);

module.exports = router;