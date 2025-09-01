const express = require('express');
const { 
  register, 
  login, 
  getMe,
  forgotPassword,
  resetPassword 
} = require('../controllers/authController');
const { protect } = require('../middleware/auth');

const router = express.Router();

// @route   POST http://localhost:5000/api/auth/register
// @desc    Register a new user
// @access  Public
router.post('/register', register);

// @route   POST http://localhost:5000/api/auth/login
// @desc    Login user and return JWT token
// @access  Public
router.post('/login', login);

// @route   GET http://localhost:5000/api/auth/me
// @desc    Get current logged in user
// @access  Private
router.get('/me', protect, getMe);

// @route   POST http://localhost:5000/api/auth/forgotpassword
// @desc    Forgot password
// @access  Public
router.post('/forgotpassword', forgotPassword);

// @route   PUT http://localhost:5000/api/auth/resetpassword/:resettoken
// @desc    Reset password
// @access  Public
router.put('/resetpassword/:resettoken', resetPassword);

module.exports = router;