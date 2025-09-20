const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
  seller: { // Changed from UserId to seller
    type: String,
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
  category: { // Added category field
    type: String,
    trim: true,
  },
  price: {
    type: Number,
    required: [true, 'Product price is required'],
  },
  quantity: { // Added quantity field
    type: Number,
    required: [true, 'Product quantity is required'],
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