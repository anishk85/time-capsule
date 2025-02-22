const Capsule = require('../models/Capsule');
const crypto = require('crypto');
const fs = require('fs');
const cron = require('node-cron');
const { sendEmail } = require('../config/email');

const scheduledJobs = {};

const scheduleEmail = (capsule) => {
    const unlockDate = new Date(capsule.unlockDate);
    const cronExpression = `${unlockDate.getUTCMinutes()} ${unlockDate.getUTCHours()} ${unlockDate.getUTCDate()} ${unlockDate.getUTCMonth() + 1} *`;

    if (scheduledJobs[capsule._id]) scheduledJobs[capsule._id].stop();

    scheduledJobs[capsule._id] = cron.schedule(cronExpression, async () => {
        await sendEmail(
            capsule.recipientEmail,
            "Your Time Capsule is Ready! 🎉",
            `Hello! Your capsule "${capsule.title}" has been unlocked today.`
        );

        delete scheduledJobs[capsule._id];
    });
};

exports.createCapsule = async (req, res) => {
    try {
        const { title, unlockDate, recipientEmail } = req.body;

        const imageBuffer = fs.readFileSync(req.file.path);
        const imageHash = crypto.createHash('sha256').update(imageBuffer).digest('hex');

        const capsule = new Capsule({ title, contributors: [req.user.id], imageHash, unlockDate, recipientEmail });

        await capsule.save();
        scheduleEmail(capsule);

        res.status(201).json({ message: "Capsule created & email scheduled!" });

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.scheduleCapsule = async (req, res) => {
    // Define the scheduleCapsule function
    // This function should handle scheduling the capsule
    // For example, you can use the scheduleEmail function here
    try {
        const { capsuleId } = req.body;
        const capsule = await Capsule.findById(capsuleId);

        if (!capsule) {
            return res.status(404).json({ message: "Capsule not found" });
        }

        scheduleEmail(capsule);

        res.status(200).json({ message: "Capsule scheduled successfully" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.contributeToCapsule = async (req, res) => {
    // Define the contributeToCapsule function
    // This function should handle contributions to the capsule
    try {
        const { capsuleId, contribution } = req.body;
        const capsule = await Capsule.findById(capsuleId);

        if (!capsule) {
            return res.status(404).json({ message: "Capsule not found" });
        }

        capsule.contributors.push(req.user.id);
        capsule.contributions.push(contribution);
        await capsule.save();

        res.status(200).json({ message: "Contribution added successfully" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};