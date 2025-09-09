const express = require('express');
const {
  createProduct,
  getProducts,
  getProduct,
  deleteProduct,
} = require('../controllers/productController');

const router = express.Router();

// @route   POST /api/products
// @desc    Create new product
// @access  Public
router.post('/', createProduct);

// @route   GET /api/products
// @desc    Get all products
// @access  Public
router.get('/', getProducts);

// @route   GET /api/products/:id
// @desc    Get single product
// @access  Public
router.get('/:id', getProduct);

// @route   DELETE /api/products/:id
// @desc    Delete product
// @access  Public
router.delete('/:id', deleteProduct);

module.exports = router;