require('dotenv').config();
const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../Models/userModel');

router.use(bodyParser.json());

async function addToken(userId ,token) {
    await User.findOneAndUpdate({ _id: userId }, {
        $push: {
            token: token
        }
    })
}

router.post('/', async (req, res) => {
    await User.findOne({ $or: [{ userName: req.body.userName }, { email: req.body.email }] })
        .exec()
        .then((user) => {
            if (user == null) {
                res.status(401).json({
                    status: false,
                    msg: "User does not exist...!"
                })
            } else {
                bcrypt.compare(req.body.password, user.password, (err, result) => {
                    if (!result) {
                        res.status(401).json({
                            status: false,
                            msg: "Password does not match...!"
                        })
                    } else {
                        const token = jwt.sign({
                            fName: user.fName,
                            lName: user.lName,
                            email: user.email,
                            userName: user.userName
                        },
                            process.env.JWT_SECRET_KEY,
                            {
                                expiresIn: '10d'
                            }
                        );

                        res.status(200).json({
                            status: true,
                            msg: "Login successfully...!",
                            data: {
                                user: {
                                    _id: user._id,
                                    fName: user.fName,
                                    lName: user.lName,
                                    email: user.email,
                                    userName: user.userName,
                                    profile_picture: user.profile_picture,
                                    contact: user.contact,
                                    country: user.country,
                                    address: user.address,
                                },
                                token: token
                            }
                        })
                        addToken(user._id, token);
                    }
                })
            }
        })
        .catch((err) => {
            console.log(err);
            res.status(401).json({
                status: false,
                msg: "Something went wrong, Please try again latter...!",
                data: err
            })
        })
})

module.exports = router;