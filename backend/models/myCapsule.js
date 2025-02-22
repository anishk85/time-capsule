const mongoose = require("mongoose");

const myCapsuleSchema = new mongoose.Schema({
    title: { type: String, required: true },
    message: { type: String, required: true },
    date: { type: Date, required: true },
    imageUrl: { type: String }
});

module.exports = mongoose.model('MyCapsule', myCapsuleSchema);