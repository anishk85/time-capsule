const express = require('express');
const { signup, verifyOTP, login, forgotPassword, resetPassword } = require('../controllers/authController');
const cookieParser = require('cookie-parser');

const router = express.Router();

// Use cookie-parser middleware
router.use(cookieParser());

// User Authentication Routes
router.post('/signup', signup);             // Step 1: User Signup
router.post('/verify-otp', verifyOTP);      // Step 2: Verify OTP
router.post('/login', login);               // Step 3: Login with JWT
// router.post('/forgot-password', forgotPassword);
// router.post('/reset-password', resetPassword);

module.exports = router;