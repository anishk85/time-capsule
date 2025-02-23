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
        const { email, date, title } = req.body;
        let imageUrl = '';

        console.log("Received Data:", req.body);

        if (req.files && req.files.image) {
            const image = req.files.image;
            
            // Upload image to Cloudinary
            const uploadResponse = await new Promise((resolve, reject) => {
                cloudinary.uploader.upload_stream(
                    { folder: 'capsules' },
                    (error, result) => {
                        if (error) {
                            console.error("Cloudinary Upload Error:", error);
                            reject(error);
                        } else {
                            resolve(result);
                        }
                    }
                ).end(image.data);
            });

            imageUrl = uploadResponse.secure_url;
            console.log("Uploaded Image URL:", imageUrl);
        }

        // Save capsule to DB
        const newCapsule = new Capsule({ title, email, date, imageUrl });
        await newCapsule.save();

        // Save email with image URL
        const newEmail = new Email({ email, date, imageUrl });
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
    const formattedTime = now.toTimeString().split(' ')[0].slice(0, 5);

    console.log('Checking emails for:', formattedTime);

    const emails = await Email.find({ date: { $lte: formattedTime } }); // Fetch past-due emails too

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
