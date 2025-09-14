const express = require('express');
const {
  createStory,
  getStories,
  getUserStories,
  viewStory,
  deleteStory
} = require('../controllers/storyController');

const router = express.Router();

// @route   POST /api/stories
// @desc    Create a new story
router.post('/', createStory);

// @route   GET /api/stories
// @desc    Get all stories
router.get('/', getStories);

// @route   GET /api/stories/user/:userId
// @desc    Get stories for a specific user
router.get('/user/:userId', getUserStories);

// @route   PUT /api/stories/:id/view
// @desc    Mark story as viewed by a user
router.put('/:id/view', viewStory);

// @route   DELETE /api/stories/:id
// @desc    Delete a story
router.delete('/:id', deleteStory);

module.exports = router;