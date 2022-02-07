const mongoose = require('mongoose');

const channelSchema = new mongoose.Schema({
    user_id: {type: String, required: true},
    channelName: {type: String, required: true},
    email: String,
    contact: Number,
    channelBio: String,
    channel_profile: String,
    createDate: Date,
    updateDate: Date
})

module.exports = mongoose.model("Channel", channelSchema);