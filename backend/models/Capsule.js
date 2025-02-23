const mongoose=require("mongoose");

const CapsuleSchema = new mongoose.Schema({
    title: { type: String,},
    email: { type: String,},
    date: { type: Date, },
    imageUrl: { type: String }
});

module.exports = mongoose.model('Capsule', CapsuleSchema);
