const MyCapsule = require("../models/myCapsule");
const cloudinary = require("../config/cloudinary");

exports.createCapsule = async (req, res) => {
    try {
        const { title, message, date } = req.body;
        if (!title || !message || !date) {
            return res.status(400).json({ message: "Title, message, and date are required." });
        }

        let imageUrl = "";
        if (req.files && req.files.image) {
            const image = req.files.image;
            const uploadResult = await cloudinary.uploader.upload(image.tempFilePath, {
                folder: "time_capsules",
            });
            imageUrl = uploadResult.secure_url;
        }

        const newCapsule = new MyCapsule({ title, message, date, imageUrl });
        const savedCapsule = await newCapsule.save();
        res.status(201).json(savedCapsule);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Get all capsules
exports.getAllCapsules = async (req, res) => {
    try {
        const capsules = await MyCapsule.find();
        res.status(200).json(capsules);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Get a single capsule by ID
exports.getCapsuleById = async (req, res) => {
    try {
        const capsule = await MyCapsule.findById(req.params.id);
        if (!capsule) {
            return res.status(404).json({ message: 'Capsule not found' });
        }
        res.status(200).json(capsule);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Update a capsule by ID
exports.updateCapsule = async (req, res) => {
    try {
        const updatedCapsule = await MyCapsule.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedCapsule) {
            return res.status(404).json({ message: 'Capsule not found' });
        }
        res.status(200).json(updatedCapsule);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// Delete a capsule by ID
exports.deleteCapsule = async (req, res) => {
    try {
        const deletedCapsule = await MyCapsule.findByIdAndDelete(req.params.id);
        if (!deletedCapsule) {
            return res.status(404).json({ message: 'Capsule not found' });
        }
        res.status(200).json({ message: 'Capsule deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};