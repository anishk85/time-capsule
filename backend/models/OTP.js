const mongoose = require('mongoose');

const OTPSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    otp: { type: String, required: true },
    hashedPassword: { type: String, required: true },  
    firstName: { type: String, required: true },      
    lastName: { type: String, required: true },       
    createdAt: { type: Date, default: Date.now },
    expiresAt: { type: Date, required: true }
});

module.exports = mongoose.model('OTP', OTPSchema);
