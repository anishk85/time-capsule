const express = require('express');
const { createCapsule } = require('../controllers/capsuleController');
const { authenticate } = require('../middlewares/authMiddleware');
const fileUpload = require('express-fileupload');

const router = express.Router();

// Ensure temporary files are enabled to avoid ENOENT errors
router.use(fileUpload({
    useTempFiles: true,
    tempFileDir: '/tmp/' // Ensure temp files are stored
}));

router.post('/create', authenticate, createCapsule);

module.exports = router;
