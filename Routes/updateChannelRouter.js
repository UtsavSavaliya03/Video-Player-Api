require('dotenv').config();
const express = require('express');
const router = express.Router();
const Channel = require('../Models/channelModel');
const AWS = require('aws-sdk');
const multer = require('multer');
const bodyParser = require('body-parser');

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

router.post('/:id', uploadFile, async (req, res) => {

    const file = req.file;

    const channel = await Channel.findById(req.params.id);
    if (file != undefined) {

        const myFile = file.originalname.split(".");
        const fileType = myFile[myFile.length - 1];
        const fileName = myFile[0].replace(/ /g, "_");

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

                await Channel.findByIdAndUpdate((req.params.id), {
                    $set: {
                        channel_profile: channelProfile,
                        channelName: req.body.channelName,
                        email: req.body.email,
                        channelBio: req.body.channelBio,
                        updateDate: Date(),
                    }
                })
                    .then((result) => {
                        res.status(200).json({
                            status: true,
                            msg: "Proflile successfully updated...!",
                        })
                    })
                    .catch((err) => {
                        res.status(401).json({
                            status: false,
                            msg: "We are face trouble to upload your image, Please try again latter...!",
                            data: err
                        })
                    })
            }
        });
        if (channel.channel_profile != undefined) {

            let previousProfilePath = (channel.channel_profile).split('/');
            let previousProfileName = previousProfilePath[previousProfilePath.length - 1];

            const params = {
                Bucket: "vdplayer/Channel Profile",
                Key: previousProfileName
            };

            s3.deleteObject(params, (error, data) => {
                if (error) {
                    console.log(error);
                }
            })
        }
    } else {
        await Channel.findByIdAndUpdate((req.params.id), {
            $set: {
                channelName: req.body.channelName,
                email: req.body.email,
                channelBio: req.body.channelBio,
                updateDate: Date(),
            }
        })
            .then((result) => {
                res.status(200).json({
                    status: true,
                    msg: "Proflile successfully updated...!",
                })
            })
            .catch((err) => {
                res.status(401).json({
                    status: false,
                    msg: "We are face trouble to upload your image, Please try again latter...!",
                    data: err
                })
            })
    }
})

module.exports = router;