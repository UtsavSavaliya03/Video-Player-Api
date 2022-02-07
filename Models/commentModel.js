const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
    user_id: {
        type: String, ref: 'User'
    },
    channel_id: String,
    video_id: String,
    cmt_reply_id: String,
    cmt_text: String,
    createDate: Date
})

module.exports = mongoose.model("Comment", commentSchema);