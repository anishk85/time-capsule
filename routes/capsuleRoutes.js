const express = require('express');
const { createCapsule } = require('../controllers/capsuleController');
const { authenticate } = require('../middlewares/authMiddleware');
const fileUpload = require('express-fileupload');

const router = express.Router();
router.use(fileUpload());

router.post('/create', authenticate, createCapsule);

module.exports = router;