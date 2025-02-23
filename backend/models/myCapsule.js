const mongoose = require("mongoose");

const MyCapsuleSchema = new mongoose.Schema({
    title: { type: String, required: true },
    message: { type: String, required: true },
    date: { type: Date, required: true },
    imageUrl: { type: String, default: "" },
    tags: { type: [String], default: [] },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true } // Linking capsule to a user
}, { timestamps: true });

module.exports = mongoose.model("MyCapsule", MyCapsuleSchema);