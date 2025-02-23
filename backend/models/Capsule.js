const mongoose = require('mongoose');

const CapsuleSchema = new mongoose.Schema({
    title: { type: String, required: true },
    email: { type: String, required: true },
    date: { type: Date, default: Date.now },
    imageUrl: { type: String },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true } 
});

module.exports = mongoose.model('Capsule', CapsuleSchema);