const Product = require('../models/Product');

// @desc    Create new product
// @route   POST /api/products
// @access  Public
exports.createProduct = async (req, res) => {
  try {
    const { 
      name, 
      description, 
      price, 
      quantity, 
      category, 
      image, 
      isBase64, 
      seller 
    } = req.body;

    // Validate required fields
    if (!name || !description || !price || !seller || !image) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields (name, description, price, seller, image)'
      });
    }

    // Log for debugging
    console.log('=== Creating Product ===');
    console.log(`Product name: ${name}`);
    console.log(`Seller: ${seller}`);
    console.log(`Image is base64: ${isBase64}`);
    console.log(`Image length: ${image ? image.length : 0} characters`);
    if (image && image.length > 50) {
      console.log(`Image preview: ${image.substring(0, 50)}...`);
    }
    console.log('========================');

    // Create and save product
    const product = await Product.create({
      name: name.trim(),
      description: description.trim(),
      price: parseFloat(price),
      quantity: parseInt(quantity) || 1,
      category: category ? category.trim() : 'Other',
      image: image, // Store the base64 image as-is
      seller: seller.trim()
    });

    console.log(`✅ Product created successfully with ID: ${product._id}`);

    res.status(201).json({
      success: true,
      data: product
    });
  } catch (error) {
    console.error('❌ Error creating product:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Get all products
// @route   GET /api/products
// @access  Public
exports.getProducts = async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    
    console.log(`📦 Found ${products.length} products`);
    
    // Log first product for debugging
    if (products.length > 0) {
      const firstProduct = products[0];
      console.log('First product debug:');
      console.log(`- Name: ${firstProduct.name}`);
      console.log(`- Seller: ${firstProduct.seller}`);
      console.log(`- Image length: ${firstProduct.image ? firstProduct.image.length : 0}`);
    }
    
    res.status(200).json({
      success: true,
      count: products.length,
      data: products,
    });
  } catch (error) {
    console.error('❌ Error fetching products:', error);
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
    const product = await Product.findById(req.params.id);

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
      message: 'Product removed',
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