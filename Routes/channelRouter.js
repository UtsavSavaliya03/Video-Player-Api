require('dotenv').config();
const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const Channel = require('../Models/channelModel');
const User = require('../Models/userModel');
const AWS = require('aws-sdk');
const multer = require('multer');

const s3 = new AWS.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_KEY,
})

const storage = multer.memoryStorage({
    destination: (req, file, callBack) => {
        callBack(null, '');
    }
})

const uploadFile = multer({ storage }).single('file');
let channelProfile = null;

router.use(bodyParser.json());

router.post('/', uploadFile, async (req, res) => {

    const file = req.file;

    const user = await User.findOne({ _id: req.body.user_id });
    const channel = await Channel.findOne({ channelName: req.body.channelName });

    if (user != null) {

        if (channel != null) {
            res.status(401).json({
                status: false,
                msg: "Channel name already exist...!"
            })
        } else {

            if (file != undefined) {

                const myFile = file.originalname.split(".");
                const fileType = myFile[myFile.length - 1];
                const fileName = myFile[0];

                const params = {
                    Bucket: "vdplayer/Channel Profile",
                    Key: fileName + "-" + Date.now() + "." + fileType, // pass key
                    Body: file.buffer, // pass file body
                    ACL: 'public-read'
                };

                s3.upload(params, async (err, data) => {
                    if (err) {
                        console.log(err);
                        res.status(500).json({
                            status: false,
                            msg: "We are face trouble to upload your image, Please try again latter...!",
                            data: err
                        })
                    } else {
                        channelProfile = data.Location;
                        console.log(channelProfile)

                        const channel = new Channel({
                            user_id: req.body.user_id,
                            channel_profile: channelProfile,
                            channelName: req.body.channelName,
                            email: req.body.email,
                            channelBio: req.body.channelBio,
                            createDate: Date(),
                            updateDate: Date(),
                        })
                        channel.save()
                            .then((channel) => {
                                res.status(200).json({
                                    status: true,
                                    msg: "Channel created successfully...!",
                                    data: channel
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
                });

            } else {

                const channel = new Channel({
                    user_id: req.body.user_id,
                    channel_profile: user.profile_picture,
                    channelName: req.body.channelName,
                    email: req.body.email,
                    channelBio: req.body.channelBio,
                    createDate: Date(),
                    updateDate: Date(),
                })
                channel.save()
                    .then((channel) => {
                        res.status(200).json({
                            status: true,
                            msg: "Channel created successfully...!",
                            data: channel
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
        }
    } else {
        return (
            res.status(401).json({
                status: false,
                msg: "Something went wrong, Please try again letter...!"
            })
        )
    }
})

module.exports = router;