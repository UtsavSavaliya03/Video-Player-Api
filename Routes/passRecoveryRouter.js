require('dotenv').config();
const express = require('express');
const router = express.Router();
const User = require('../Models/userModel');
const OtpData = require('../Models/otpModel');
const bodyParser = require('body-parser');

router.use(bodyParser.json());

router.post('/', async (req, res) => {
    await User.findOne({email: req.body.email})
    .then((user)=>{
        if(user == null) {
            return res.status(401).json({
                status: false,
                msg: 'Please enter your registered email...!'
            })
        } else {
            const otpCode = Math.floor(100000 + Math.random() * 900000);

            const otpData = new OtpData({
                email: req.body.email,
                otpCode: otpCode,
                expiresIn: new Date().getTime() + 300 * 1000 // Miliseconds(300 sec - 5 min) 
            })
            const name =  user.fName + ' ' + user.lName;
            mailer(user.email , otpCode, name);
            otpData.save()
            .then((result) => {
                res.status(200).json({
                    status: true,
                    msg: 'Otp is successfully send on ' + user.email
                })
            })
        }
    })
    .catch((err) => {
        console.log(err);
        res.status(401).json({
            status: false,
            msg: 'Something went wrong, Please try again...',
            data: err
        })
    });
})

const mailer = (userEmail, otp, userName) => {
    var nodemailer = require('nodemailer');
    var transporter = nodemailer.createTransport({
        host: "smtp.ethereal.email",
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
            user: process.env.MAILER_EMAIL, // generated ethereal user
            pass: process.env.MAILER_EMAIL_PASS, // generated ethereal password
        },
    });
    var mailOptions = {
        from: process.env.MAILER_EMAIL, // sender address
        to: userEmail, // list of receivers
        subject: "Password recovery", // Subject line
        text: "Hello " + userName + ", Your password recovery otp is " + otp + "." + "This Code is valid for next 5 minutes.", // plain text body
        html: "Hello " + userName + ", Your password recovery otp is " + otp + "." + "This Code is valid for next 5 minutes." // html body
    }
    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    })
};

module.exports = router;