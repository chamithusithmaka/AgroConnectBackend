const mongoose = require('mongoose');

const CommentSchema = new mongoose.Schema({
  user: {
    type: String, // Changed from ObjectId to String
    required: true
  },
  text: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const PostSchema = new mongoose.Schema({
  user: {
    type: String, // Changed from ObjectId to String
    required: true
  },
  heading: {
    type: String,
    required: [true, 'Please add a heading'],
    trim: true,
    maxlength: [100, 'Heading cannot be more than 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Please add a description']
  },
  image: {
    type: String,
    required: [true, 'Please add an image']
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },
  likes: [
    {
      type: String // Changed from ObjectId to String
    }
  ],
  comments: [CommentSchema],
  category: {
    type: String,
    trim: true
  },
  location: {
    type: String,
    trim: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Post', PostSchema);