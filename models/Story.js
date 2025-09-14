const mongoose = require('mongoose');

const StorySchema = new mongoose.Schema({
  user: {
    type: String, // Using string instead of ObjectId
    required: true
  },
  image: {
    type: String, // Base64 string or image URL
    required: true
  },
  caption: {
    type: String,
    default: ''
  },
  viewers: [
    {
      type: String // Users who viewed this story
    }
  ],
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 86400 // Auto-delete stories after 24 hours (86400 seconds)
  }
});

module.exports = mongoose.model('Story', StorySchema);