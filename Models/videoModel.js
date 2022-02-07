const mongoose = require('mongoose');

const videoSchema = new mongoose.Schema({
    user_id: String,
    channel_id: {
        type: String, ref: 'Channel',
    },
    videoContent_link: String,
    thumbnailImage_link: String,
    videoName: String,
    description: String,
    category: String,
    views: Array,
    tags: Array,
    visibility: String,
    createDate: Date
})

module.exports = mongoose.model("Videos", videoSchema);