const Video = require("../models/video");
const cloudinary = require("../config/cloudinary");
const fs = require("fs");
const path = require("path");

exports.uploadVideo = async (req, res) => {
    try {
        if (!req.files || !req.files.video) {
            return res.status(400).json({ message: "No video file uploaded" });
        }

        const video = req.files.video;
        const uploadPath = path.join(__dirname, "../uploads", video.name);
        await video.mv(uploadPath);

        console.log("🚀 Uploading video to Cloudinary...");

        const uploadResult = await cloudinary.uploader.upload(uploadPath, {
            resource_type: "video",
            folder: "time_capsules"
        });

        console.log("✅ Video uploaded successfully!");

        const newVideo = new Video({
            url: uploadResult.secure_url,
            tags: [] 
        });

        await newVideo.save();

        fs.unlinkSync(uploadPath);

        res.status(201).json({
            message: "Video uploaded successfully!",
            video: newVideo
        });

    } catch (error) {
        console.error("❌ Error uploading video:", error);
        res.status(500).json({ message: "Error uploading video", error: error.message });
    }
};
