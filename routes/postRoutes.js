const express = require('express');
const {
  getPosts,
  getPost,
  createPost,
  updatePost,
  deletePost,
  likePost,
  addComment,
  deleteComment,
  updatePostStatus,
  getPostLikesCount,  // Add this
  getPostComments     // Add this
} = require('../controllers/postController');

const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// @route   GET http://localhost:5000/api/posts
// @desc    Get all posts
// @access  Public (with restrictions based on status)
// @route   POST http://localhost:5000/api/posts
// @desc    Create a new post
// @access  Private
router.route('/')
  .get(getPosts)
  .post(createPost); // <-- Remove 'protect' middleware here

// @route   GET http://localhost:5000/api/posts/:id
// @desc    Get single post by ID
// @access  Public (with restrictions)
// @route   PUT http://localhost:5000/api/posts/:id
// @desc    Update a post
// @access  Private (owner or admin)
// @route   DELETE http://localhost:5000/api/posts/:id
// @desc    Delete a post
// @access  Private (owner or admin)
router.route('/:id')
  .get(getPost)
  .put(protect, updatePost)
  .delete(protect, deletePost);

// @route   PUT http://localhost:5000/api/posts/:id/like
// @desc    Like or unlike a post
// @access  Private
router.put('/:id/like', protect, likePost);

// @route   POST http://localhost:5000/api/posts/:id/comments
// @desc    Add comment to a post
// @access  Private
router.route('/:id/comments')
  .post(protect, addComment);

// @route   DELETE http://localhost:5000/api/posts/:id/comments/:commentId
// @desc    Delete comment from a post
// @access  Private (comment owner or admin)
router.route('/:id/comments/:commentId')
  .delete(protect, deleteComment);

// @route   PUT http://localhost:5000/api/posts/:id/status
// @desc    Update post status (pending, approved, rejected)
// @access  Admin only
router.put('/:id/status', protect, authorize('admin'), updatePostStatus);

// @route   GET http://localhost:5000/api/posts/:id/likes
// @desc    Get likes count for a specific post
// @access  Public (with restrictions)
router.get('/:id/likes', getPostLikesCount);

// @route   GET http://localhost:5000/api/posts/:id/comments
// @desc    Get all comments for a specific post
// @access  Public (with restrictions)
router.get('/:id/comments', getPostComments);

module.exports = router;