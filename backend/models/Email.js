const mongoose = require('mongoose');

const EmailSchema = new mongoose.Schema({
    email: String,
    date: Date,
    imageUrl: { type: String }
});

module.exports = mongoose.model('Email', EmailSchema);