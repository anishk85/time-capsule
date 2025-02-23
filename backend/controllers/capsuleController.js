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
exports.createCapsule = async (req, res) => {
    try {
        const { title, email, date } = req.body;
        const userId = req.user ? req.user.id : null;
        let imageUrl = '';

        console.log("Received Data:", req.body);
        console.log("Files:", req.files);

        // Validate required fields
        if (!title || !email || !date) {
            return res.status(400).json({ message: 'Title, email, and date are required' });
        }

        // Handle File Upload
        if (req.files && req.files.image) {
            const image = req.files.image;

            if (!image.size) {
                return res.status(400).json({ message: 'Empty file received' });
            }

            console.log("Temporary File Path:", image.tempFilePath);

            if (!image.tempFilePath) {
                return res.status(500).json({ message: 'Temporary file path missing' });
            }

            try {
                // Upload to Cloudinary
                const uploadResponse = await cloudinary.uploader.upload(image.tempFilePath, {
                    folder: 'capsules'
                });

                imageUrl = uploadResponse.secure_url;
                console.log("Uploaded Image URL:", imageUrl);
            } catch (cloudinaryError) {
                console.error("Cloudinary Upload Error:", cloudinaryError);
                return res.status(500).json({ message: 'Error uploading image', error: cloudinaryError });
            }
        }

        // Parse and validate date
        const parsedDate = new Date(date);
        if (isNaN(parsedDate.getTime())) {
            return res.status(400).json({ message: 'Invalid date format' });
        }

        // Save Capsule to DB
        const newCapsule = new Capsule({ title, userId, email, date: parsedDate, imageUrl });
        await newCapsule.save();

        // Save Email with Image URL
        const newEmail = new Email({ email, date: parsedDate, imageUrl });
        await newEmail.save();

        res.status(201).json({ message: 'Capsule created successfully!', imageUrl });
    } catch (error) {
        console.error("Error creating capsule:", error);
        res.status(500).json({ message: 'Error creating capsule', error });
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