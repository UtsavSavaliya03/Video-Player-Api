const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt')
const User = require('../Models/userModel');
const mongoose = require('mongoose');

router.use(bodyParser.json());

router.post('/', async (req, res) => {
    const user = await User.findOne({ email: req.body.email });
    
    if (user != null) {
        res.status(401).json({
            status: false,
            msg: "User already exist...!"
        })
    } else {
        bcrypt.hash(req.body.password, 10, (err, hashPassword) => {
            if (err) {
                res.status(401).json({
                    status: false,
                    msg: "Something went wrong, Please try again letter...!",
                    data: err
                })
            } else {
                const user = new User({
                    fName: req.body.fName,
                    lName: req.body.lName,
                    userName: req.body.userName,
                    email: req.body.email,
                    password: hashPassword,
                    createDate: Date(),
                    updateDate: Date()
                });
                user.save()
                    .then((result) => {
                        res.status(200).json({
                            status: true,
                            msg: "Signup Successfully...!",
                            data: result
                        })
                    })
                    .catch((err) => {
                        console.log(err);
                        res.status(401).json({
                            status: false,
                            msg: "Something went wrong, Please try again letter...!",
                            data: err
                        })
                    })
            }
        })
    }
})

module.exports = router;