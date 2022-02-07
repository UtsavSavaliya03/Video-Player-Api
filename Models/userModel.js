const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    profile_picture: String,
    fName: String,
    lName: String,
    userName: String,
    email: String,
    contact: Number,
    country: String,
    address: String,
    password: String,
    createDate: Date,
    updateDate: Date
}); 

module.exports = mongoose.model('User', userSchema);