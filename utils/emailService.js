const Otp = require('../models/OTP');
const generateOtp = require('../utils/generateOtp');

exports.sendOtp = async (req, res) => {
    try {
        const { email } = req.body;
        const otpCode = generateOtp();

        // ✅ Update existing OTP if the email already exists
        const otpEntry = await Otp.findOneAndUpdate(
            { email }, // Find by email
            { otp: otpCode, createdAt: Date.now() }, // Update OTP and timestamp
            { upsert: true, new: true } // Create if not exists
        );

        // Send OTP via email (assuming you use Nodemailer)
        await transporter.sendMail({
            to: email,
            subject: "Your OTP Code",
            text: `Your OTP is ${otpCode}. It expires in 10 minutes.`,
        });

        res.json({ message: "OTP sent successfully!" });

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
