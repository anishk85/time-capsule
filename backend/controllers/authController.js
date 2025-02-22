const User = require('../models/User');
const OTP = require('../models/OTP');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { sendEmail } = require('../config/email');

const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

const generateToken = (user) => {
    return jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '7d' });
};

// **Signup with OTP**
exports.signup = async (req, res) => {
    try {
        const { email, password } = req.body;

        let existingUser = await User.findOne({ email });
        if (existingUser) return res.status(400).json({ message: "User already exists" });

        const hashedPassword = await bcrypt.hash(password, 10);
        const otp = generateOTP();

        await OTP.create({ email, otp, expiresAt: Date.now() + 300000 }); // OTP expires in 5 min

        await sendEmail(email, "Verify Your Account", `Your OTP is ${otp}. It expires in 5 minutes.`);

        const newUser = new User({ email, password: hashedPassword });
        await newUser.save();

        res.status(201).json({ message: "User registered. OTP sent to email." });

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// **Verify OTP**
exports.verifyOTP = async (req, res) => {
    try {
        const { email, otp } = req.body;
        const storedOTP = await OTP.findOne({ email });

        if (!storedOTP || storedOTP.otp !== otp || storedOTP.expiresAt < Date.now()) {
            return res.status(400).json({ message: "Invalid or expired OTP" });
        }

        await User.findOneAndUpdate({ email }, { isVerified: true });
        await OTP.deleteOne({ email }); // Remove OTP after successful verification

        res.status(200).json({ message: "Account verified. You can now log in." });

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// **Login**
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if (!user) return res.status(400).json({ message: "User not found" });
        if (!user.isVerified) return res.status(403).json({ message: "Please verify your account first." });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: "Incorrect password" });

        const token = generateToken(user);
        res.status(200).json({ message: "Login successful", token });

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
