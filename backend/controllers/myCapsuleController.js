const MyCapsule = require("../models/myCapsule");
const User = require("../models/User"); // Assuming there's a User model
const cloudinary = require("../config/cloudinary");
const { spawn } = require("child_process");
const Email = require("../models/Email");

// Create Capsule
exports.createCapsule = async (req, res) => {
    try {
        const { title, message, date } = req.body;
        const userId = req.user.id; // Assuming user ID is available in req.user

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

        console.log("🚀 Running Sentiment Analysis...");

        const pythonProcess = spawn("python", ["ml/sentiment_analysis.py", title, message]);

        let resultData = "";

        // Collect Python output
        pythonProcess.stdout.on("data", (data) => {
            resultData += data.toString();
        });

        pythonProcess.on("close", async (code) => {
            console.log(`✅ Python process exited with code ${code}`);

            try {
                const result = JSON.parse(resultData);

                if (result.error) {
                    return res.status(500).json({ message: "Error running sentiment analysis", error: result.error });
                }

                // Store detected sentiment tags
                const tags = [result.title, result.message];

                // Save Capsule linked to user
                const newCapsule = new MyCapsule({ user: userId, title, message, date, imageUrl, tags });
                const savedCapsule = await newCapsule.save();

                // Save email entry
                const newEmail = new Email({ email: req.user.email, date });
                await newEmail.save();

                res.status(201).json(savedCapsule);
            } catch (jsonError) {
                res.status(500).json({ message: "Error processing sentiment analysis output." });
            }
        });

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Get all capsules for a user
exports.getAllCapsules = async (req, res) => {
    try {
        const capsules = await MyCapsule.find({ user: req.user.id });
        res.status(200).json(capsules);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Get a single capsule by ID (ensuring ownership)
exports.getCapsuleById = async (req, res) => {
    try {
        const capsule = await MyCapsule.findOne({ _id: req.params.id, user: req.user.id });
        if (!capsule) {
            return res.status(404).json({ message: 'Capsule not found' });
        }
        res.status(200).json(capsule);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Update a capsule by ID (ensuring ownership)
exports.updateCapsule = async (req, res) => {
    try {
        const updatedCapsule = await MyCapsule.findOneAndUpdate(
            { _id: req.params.id, user: req.user.id },
            req.body,
            { new: true }
        );

        if (!updatedCapsule) {
            return res.status(404).json({ message: 'Capsule not found' });
        }
        res.status(200).json(updatedCapsule);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// Delete a capsule by ID (ensuring ownership)
exports.deleteCapsule = async (req, res) => {
    try {
        const deletedCapsule = await MyCapsule.findOneAndDelete({ _id: req.params.id, user: req.user.id });

        if (!deletedCapsule) {
            return res.status(404).json({ message: 'Capsule not found' });
        }
        res.status(200).json({ message: 'Capsule deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
