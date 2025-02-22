const mongoose=require("mongoose");

const CapsuleSchema = new mongoose.Schema({
    title: { type: String,},
    email: { type: String,},
    date: { type: String, },
    imageUrl: { type: String }
});

module.exports = mongoose.model('Capsule', CapsuleSchema);
