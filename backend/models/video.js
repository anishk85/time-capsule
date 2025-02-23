const mongoose = require("mongoose");

const videoSchema = new mongoose.Schema({
    url: { type: String, required: true },
    tags: { type: [String], default: [] },
});

module.exports = mongoose.model("Video", videoSchema);
