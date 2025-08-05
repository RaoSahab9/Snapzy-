const express = require('express');
const { body } = require('express-validator');
const { protect, optionalAuth } = require('../middleware/auth');
const {
  getPosts,
  createPost,
  getPost,
  updatePost,
  deletePost,
  likePost,
  addComment,
  getUserPosts
} = require('../controllers/postController');

const router = express.Router();

// Validation middleware
const createPostValidation = [
  body('caption')
    .optional()
    .isLength({ max: 1000 })
    .withMessage('Caption cannot exceed 1000 characters'),
  body('location')
    .optional()
    .isLength({ max: 100 })
    .withMessage('Location cannot exceed 100 characters'),
  body('tags')
    .optional()
    .isLength({ max: 200 })
    .withMessage('Tags string cannot exceed 200 characters')
];

const updatePostValidation = [
  body('caption')
    .optional()
    .isLength({ max: 1000 })
    .withMessage('Caption cannot exceed 1000 characters'),
  body('location')
    .optional()
    .isLength({ max: 100 })
    .withMessage('Location cannot exceed 100 characters'),
  body('tags')
    .optional()
    .isLength({ max: 200 })
    .withMessage('Tags string cannot exceed 200 characters')
];

const commentValidation = [
  body('text')
    .isLength({ min: 1, max: 500 })
    .withMessage('Comment must be between 1 and 500 characters')
];

// Routes
router.get('/', protect, getPosts);
router.get('/user/:userId', getUserPosts);
router.get('/:id', optionalAuth, getPost);

router.post('/', protect, createPostValidation, createPost);
router.post('/:id/like', protect, likePost);
router.post('/:id/comments', protect, commentValidation, addComment);

router.put('/:id', protect, updatePostValidation, updatePost);

router.delete('/:id', protect, deletePost);

module.exports = router;