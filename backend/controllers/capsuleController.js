const Capsule = require('../models/Capsule');
const Email = require('../models/Email');
const cloudinary = require('../config/cloudinary');
const nodemailer = require('nodemailer');
const cron = require('node-cron');

// Nodemailer transporter setup
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// Create Capsule Controller
const axios = require('axios');

exports.createCapsule = async (req, res) => {
    try {
        const { title, message, date } = req.body;
        const userId = req.user.id;

        if (!title || !message || !date) {
            return res.status(400).json({ message: "Title, message, and date are required." });
        }

        let imageUrl = "";
        if (req.files && req.files.image) {
            const image = req.files.image;
            const uploadResult = await cloudinary.uploader.upload(image.tempFilePath, { folder: "time_capsules" });
            imageUrl = uploadResult.secure_url;
        }

        console.log("🚀 Running Sentiment Analysis...");

        const response = await axios.post('https://time-capsule-fastapi-1.onrender.com/analyze', {
            title,
            message
        });

        const result = response.data;

        if (!result || result.length === 0) {
            return res.status(500).json({ message: "No response from sentiment analysis API." });
        }

        console.log("✅ Sentiment Analysis Result:", result);

        if (result.error) {
            return res.status(500).json({ message: "Error in sentiment analysis", error: result.error });
        }

        const tags = [result.title, result.message];

        // Save Capsule
        const newCapsule = new Capsule({ user: userId, title, message, date, imageUrl, tags });
        const savedCapsule = await newCapsule.save();

        // Save Email Entry
        const newEmail = new Email({ email: req.user.email, date });
        await newEmail.save();

        res.status(201).json(savedCapsule);

    } catch (err) {
        console.error("❌ Error in createCapsule:", err);
        res.status(500).json({ message: err.message });
    }
};
// Cron job to send scheduled emails (checks current & past missed emails)
cron.schedule('* * * * *', async () => {
    const now = new Date();
    const formattedTime = now.toISOString().slice(0, 16); // "YYYY-MM-DDTHH:MM"

    console.log('Checking emails for:', formattedTime);

    const emails = await Email.find({ date: { $lte: now } }); // Fetch past-due emails too

    if (emails.length === 0) {
        console.log('No scheduled emails for this time.');
        return;
    }

    emails.forEach(async (emailEntry) => {
        try {
            console.log(`Sending email to: ${emailEntry.email} with image: ${emailEntry.imageUrl}`);

            await transporter.sendMail({
                from: process.env.EMAIL_USER,
                to: emailEntry.email,
                subject: 'Your Scheduled Capsule',
                html: `
                    <p>This is your scheduled email at ${formattedTime}!</p>
                    ${emailEntry.imageUrl ? `<img src="${emailEntry.imageUrl}" alt="Capsule Image" width="300"/>` : '<p>No image attached.</p>'}
                `
            });

            console.log(`Email sent to: ${emailEntry.email}`);

            // **Delete the email entry using `_id`**
            await Email.findByIdAndDelete(emailEntry._id);
            console.log(`Deleted email entry for: ${emailEntry.email}`);
        } catch (error) {
            console.error('Error sending email:', error);
        }
    });
});