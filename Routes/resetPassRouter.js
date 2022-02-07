const express = require('express');
const router = express.Router();
const OtpData = require('../Models/otpModel');
const User = require('../Models/userModel');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');

router.use(bodyParser.json());

router.post('/', async (req, res) => {
    const user = await OtpData.findOne({ $and: [{ email: req.body.email }, { otpCode: req.body.otpCode }] });
    if (user == null) {
        return res.status(401).json({
            status: false,
            msg: 'Please enter valid OTP code...!'
        })
    } else {
        let currentTime = new Date().getTime();
        let difference = user.expiresIn - currentTime;
        if (user.otpCode != req.body.otpCode) {
            return res.status(401).json({
                status: false,
                msg: "Please enter valid OTP code...!"
            })
        } else if (difference < 0) {
            return res.status(401).json({
                status: false,
                msg: "Sorry, Token expired...!"
            })
        } else {
            bcrypt.hash(req.body.password, 10, async (err, hashPassword) => {
                if (err) {
                    res.status(401).json({
                        status: false,
                        msg: "Something went wrong, Please try again letter...!",
                        data: err
                    })
                } else {
                    await User.updateOne({email: user.email}, {$set:{
                        password: hashPassword,
                        updateDate: Date()
                    }})
                    return res.status(200).json({
                        status: true,
                        msg: "Password changed successfully...!"
                    })
                }
            })
        }
    }
})

module.exports = router;