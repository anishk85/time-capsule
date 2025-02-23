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
// const bcrypt = require('bcrypt');
// const User = require('../models/User');
// const OTP = require('../models/OTP');
// const sendEmail = require('../utils/sendEmail');  // Assumes a function to send emails

// Generate OTP
// const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

// **Signup - Store OTP and Hashed Password Temporarily**
exports.signup = async (req, res) => {
    try {
        const { email, password, Name} = req.body;

        // ✅ Check if user already exists
        let existingUser = await User.findOne({ email });
        if (existingUser) return res.status(400).json({ message: "User already exists" });

        const hashedPassword = await bcrypt.hash(password, 10);
        const otp = generateOTP();

        // ✅ Delete any existing OTP for this email before creating a new one
        await OTP.deleteOne({ email });

        // ✅ Store OTP along with user details (without creating User yet)
        await OTP.create({
            email,
            otp,
            hashedPassword,
            Name,
            expiresAt: Date.now() + 5 * 60 * 1000 // 5 minutes
        });

        await sendEmail(email, "Verify Your Account", `Your OTP is ${otp}. It expires in 5 minutes.`);

        res.status(201).json({ message: "OTP sent to email. Verify to complete registration." });

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// **🔹 Verify OTP - Create User After Successful Verification**
exports.verifyOTP = async (req, res) => {
    try {
        const { email, otp } = req.body;

        // ✅ Check if OTP exists
        const storedOTP = await OTP.findOne({ email });
        if (!storedOTP) return res.status(400).json({ message: "OTP not found. Please sign up again." });

        // ✅ Validate OTP and check expiry
        if (storedOTP.otp !== otp) return res.status(400).json({ message: "Invalid OTP" });
        if (storedOTP.expiresAt < Date.now()) return res.status(400).json({ message: "OTP expired. Please sign up again." });

        // ✅ Create User ONLY AFTER OTP is Verified
        const newUser = new User({
            email,
            password: storedOTP.hashedPassword,
            Name: storedOTP.Name,
            isVerified: true
        });

        await newUser.save();
        await OTP.deleteOne({ email }); // ✅ Remove OTP after successful verification

        // ✅ Generate JWT Token after successful registration
        const token = generateToken(newUser);

        res.status(200).json({ message: "Account verified and registered. You can now log in.", token });

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
// **Login**
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        // console.log("printing user",user);

        if (!user) return res.status(400).json({ message: "User not found" });
        if (!user.isVerified) return res.status(403).json({ message: "Please verify your account first." });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: "Incorrect password" });

        const token = generateToken(user);

        // Send token in cookies
        res.cookie('token', token, { httpOnly: true, secure: process.env.NODE_ENV === 'production' });
        res.status(200).json({ message: "Login successful","token":token,"Name":user.Name});

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
