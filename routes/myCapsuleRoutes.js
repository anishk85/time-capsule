const express = require('express');
const fileUpload = require("express-fileupload");
const {
    createCapsule,
    getAllCapsules,
    getCapsuleById,
    updateCapsule,
    deleteCapsule
} = require('../controllers/myCapsuleController');
const { authenticate } = require('../middlewares/authMiddleware');

const router = express.Router();

// Middleware to handle file uploads
router.use(fileUpload({ useTempFiles: true }));

// Capsule Routes
router.post('/', authenticate, createCapsule);
router.get('/',authenticate, getAllCapsules);
router.get('/:id',authenticate, getCapsuleById);
router.put('/:id',authenticate, updateCapsule);
router.delete('/:id',authenticate, deleteCapsule);

module.exports = router;
