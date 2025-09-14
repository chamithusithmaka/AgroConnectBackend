const Product = require('../models/Product');

// @desc    Create new product
// @route   POST /api/products
// @access  Public
exports.createProduct = async (req, res) => {
  try {
    const { name, description, location, price, contact, image, UserId } = req.body;

    // Check if all required fields are provided
    if (!name || !description || !price || !contact || !image || !UserId) {
      return res.status(400).json({
        success: false,
        message: 'Please provide name, description, price, contact, image, and UserId',
      });
    }

    // Create a new product document
    const product = new Product({
      name,
      description,
      location,
      price,
      contact,
      image,
      UserId,  // Use UserId (uppercase) to match the schema
    });

    // Save the product to the database
    await product.save();

    // Send response with the newly created product
    res.status(201).json({
      success: true,
      data: product,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
};
// @desc    Get all products
// @route   GET /api/products
// @access  Public
exports.getProducts = async (req, res) => {
  try {
    // Remove the populate since UserId is a String, not a reference
    const products = await Product.find();
    
    res.status(200).json({
      success: true,
      count: products.length,
      data: products,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
};


// @desc    Get single product
// @route   GET /api/products/:id
// @access  Public
exports.getProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate('user', 'fullName email'); // Populate user details

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    res.status(200).json({
      success: true,
      data: product,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
};

// @desc    Delete product
// @route   DELETE /api/products/:id
// @access  Public
exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Product deleted successfully',
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
};