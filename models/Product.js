const mongoose = require('mongoose');
const User = require('./User');

const ProductSchema = new mongoose.Schema({
  UserId: {
    type:String,
    required: true
  },
  name: {
    type: String,
    required: [true, 'Product name is required'],
    trim: true,
  },
  description: {
    type: String,
    required: [true, 'Product description is required'],
    trim: true,
  },
  location: {
    type: String,
    trim: true,
  },
  price: {
    type: Number,
    required: [true, 'Product price is required'],
  },
  contact: {
    type: String,
    required: [true, 'Contact number is required'],
  },
  image: {
    type: String, // Base64 string or image URL
    required: [true, 'Image is required'],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Product', ProductSchema);