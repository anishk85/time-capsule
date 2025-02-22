const express = require("express");
const fileUpload = require("express-fileupload");
const router = express.Router();
const videoController = require("../controllers/videoController");

// Middleware to handle file uploads
router.use(fileUpload({
    useTempFiles: true,
    tempFileDir: '/tmp/'
}));

// Route to upload video
router.post("/upload", videoController.uploadVideo);

module.exports = router;