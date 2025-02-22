const express = require('express');
const { createCapsule, scheduleCapsule, contributeToCapsule } = require('../controllers/capsuleController');
const { authenticate } = require('../middlewares/authMiddleware');
const multer = require('multer');
const cookieParser = require('cookie-parser');

const router = express.Router();

// Setup Multer for File Upload
const upload = multer({ dest: 'uploads/' });

// Use cookie-parser middleware
router.use(cookieParser());

// Capsule Routes
router.post('/create', authenticate, createCapsule); 
// upload.single('image')
// router.post('/schedule', authenticate, scheduleCapsule);
// router.post('/contribute', authenticate, contributeToCapsule);

module.exports = router;