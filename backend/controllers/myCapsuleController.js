const MyCapsule = require("../models/myCapsule");
const cloudinary = require("../config/cloudinary");
const { spawn } = require("child_process");

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

        console.log("🚀 Running Sentiment Analysis...");

        const pythonProcess = spawn("python", ["ml/sentiment_analysis.py", title, message]);

        let resultData = "";

        // ✅ Collect the entire Python output
        pythonProcess.stdout.on("data", (data) => {
            resultData += data.toString();
        });

        pythonProcess.stderr.on("data", (error) => {
            console.error("❌ Python Error:", error.toString());
        });

        pythonProcess.on("close", async (code) => {
            console.log(`✅ Python process exited with code ${code}`);

            try {
                // ✅ Ensure valid JSON
                const result = JSON.parse(resultData);

                if (result.error) {
                    console.error("❌ Sentiment Analysis Error:", result.error);
                    return res.status(500).json({ message: "Error running sentiment analysis", error: result.error });
                }

                // ✅ Store detected sentiment tags
                const tags = [result.title, result.message];

                // ✅ Save Capsule with Sentiment Tags
                const newCapsule = new MyCapsule({ title, message, date, imageUrl, tags });
                const savedCapsule = await newCapsule.save();

                // ✅ Send response once
                res.status(201).json(savedCapsule);
            } catch (jsonError) {
                console.error("❌ JSON Parse Error:", jsonError);
                res.status(500).json({ message: "Error processing sentiment analysis output." });
            }
        });

    } catch (err) {
        console.error("❌ Server Error:", err);
        res.status(500).json({ message: err.message });
    }
};

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