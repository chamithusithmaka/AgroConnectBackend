const Story = require('../models/Story');

// @desc    Create new story
// @route   POST /api/stories
// @access  Public
exports.createStory = async (req, res) => {
  try {
    const { user, image, caption } = req.body;

    // Validate input
    if (!user || !image) {
      return res.status(400).json({
        success: false,
        message: 'Please provide user and image'
      });
    }

    // Create story
    const story = await Story.create({
      user,
      image,
      caption: caption || '',
      viewers: []
    });

    res.status(201).json({
      success: true,
      data: story
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Get all stories
// @route   GET /api/stories
// @access  Public
exports.getStories = async (req, res) => {
  try {
    // Get all stories created in the last 24 hours
    const stories = await Story.find()
      .sort({ createdAt: -1 }); // Most recent first

    // Group stories by user
    const groupedStories = stories.reduce((acc, story) => {
      const userId = story.user;
      if (!acc[userId]) {
        acc[userId] = [];
      }
      acc[userId].push(story);
      return acc;
    }, {});

    // Convert to array format
    const result = Object.keys(groupedStories).map(userId => ({
      user: userId,
      stories: groupedStories[userId]
    }));

    res.status(200).json({
      success: true,
      count: result.length,
      data: result
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Get user stories
// @route   GET /api/stories/user/:userId
// @access  Public
exports.getUserStories = async (req, res) => {
  try {
    const stories = await Story.find({ user: req.params.userId })
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: stories.length,
      data: stories
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    View a story
// @route   PUT /api/stories/:id/view
// @access  Public
exports.viewStory = async (req, res) => {
  try {
    const { viewerId } = req.body;

    if (!viewerId) {
      return res.status(400).json({
        success: false,
        message: 'Please provide viewerId'
      });
    }

    const story = await Story.findById(req.params.id);

    if (!story) {
      return res.status(404).json({
        success: false,
        message: 'Story not found'
      });
    }

    // Only add viewer if they haven't viewed already
    if (!story.viewers.includes(viewerId)) {
      story.viewers.push(viewerId);
      await story.save();
    }

    res.status(200).json({
      success: true,
      data: story
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Delete story
// @route   DELETE /api/stories/:id
// @access  Public
exports.deleteStory = async (req, res) => {
  try {
    const story = await Story.findById(req.params.id);

    if (!story) {
      return res.status(404).json({
        success: false,
        message: 'Story not found'
      });
    }

    await Story.deleteOne({ _id: req.params.id });

    res.status(200).json({
      success: true,
      message: 'Story deleted successfully'
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};