const mongoose = require('mongoose');

const favouriteSchema = new mongoose.Schema({
    user_id: String,
    video_id: {
        type: String , ref: 'Videos'
    },
    createDate: Date
})

module.exports = mongoose.model("Favourite", favouriteSchema);