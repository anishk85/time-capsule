const Capsule = require('../models/Capsule');
const Email = require('../models/Email');
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

// Create capsule controller
exports.createCapsule = async (req, res) => {
    try {
        const { email, date } = req.body;

        // Create a new capsule
        const newCapsule = new Capsule({ email, date });
        await newCapsule.save();

        // Save email to be sent later
        const newEmail = new Email({ email, date });
        await newEmail.save();

        res.status(201).json({ message: 'Capsule created successfully!' });
    } catch (error) {
        res.status(500).json({ message: 'Error creating capsule', error });
    }
};

// Cron job to send scheduled emails
cron.schedule('* * * * *', async () => { // Runs every minute
    const now = new Date();
    const formattedTime = now.toTimeString().split(' ')[0].slice(0, 5); // "HH:MM"
    // console.log(formattedTime);
    console.log('Checking emails for:', formattedTime);

    const emails = await Email.find({ date: formattedTime }); // Match only by time
    console.log('Found emails:', emails);

    emails.forEach(async ({ email }) => {
        try {
            await transporter.sendMail({
                from: process.env.EMAIL_USER,
                to: email,
                subject: 'Scheduled Email',
                text: `This is your scheduled email at ${formattedTime}!`
            });

            console.log(`Email sent to: ${email}`);

            // Remove the email from DB after sending
            await Email.deleteOne({ email, date: formattedTime });
        } catch (error) {
            console.error('Error sending email:', error);
        }
    });
});