const mongoose = require('mongoose');

const CapsuleSchema = new mongoose.Schema({
    title: { type: String, required: true },
    contributors: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    imageHash: { type: String, required: true },
    unlockDate: { type: Date, required: true },
    recipientEmail: { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model('Capsule', CapsuleSchema);
