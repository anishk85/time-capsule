const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

exports.sendEmail = async (to, subject, text) => {
    try {
        await transporter.sendMail({ from: process.env.EMAIL_USER, to, subject, text });
        console.log(`✅ Email sent to ${to}`);
    } catch (err) {
        console.error(`❌ Failed to send email: ${err.message}`);
    }
};
