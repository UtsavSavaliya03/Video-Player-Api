const mongoose = require('mongoose');

const otpschema = new mongoose.Schema({
    email: String,
    otpCode: String,
    expiresIn: String
});

module.exports = mongoose.model("OtpData", otpschema);