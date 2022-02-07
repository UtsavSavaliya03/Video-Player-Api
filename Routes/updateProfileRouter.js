require('dotenv').config();
const express = require('express');
const router = express.Router();
const User = require('../Models/userModel');
const bodyParser = require('body-parser');
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
let profilePicture = null;

router.use(bodyParser.json());

router.post('/:id', uploadFile, async (req, res) => {

    const file = req.file;

    const user = await User.findById(req.params.id);
    if (user != null) {

        if (file != undefined) {

            const myFile = file.originalname.split(".");
            const fileType = myFile[myFile.length - 1];
            const fileName = myFile[0].replace(/ /g,"_");

            const params = {
                Bucket: "vdplayer/Profile Picture",
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
                    profilePicture = data.Location;
                    console.log(profilePicture)

                    await User.findByIdAndUpdate(req.params.id , {
                        $set: {

                            profile_picture: profilePicture,
                            userName: req.body.userName,
                            email: req.body.email,
                            fName: req.body.fName,
                            lName: req.body.lName,
                            contact: req.body.contact,
                            country: req.body.country,
                            address: req.body.address,
                            updateDate: Date()
                        }
                    });
                }
            });
            if (user.profile_picture != undefined) {

                let previousProfilePath = (user.profile_picture).split('/');
                let previousProfileName = previousProfilePath[previousProfilePath.length - 1];

                const params = {
                    Bucket: "vdplayer/Profile Picture",
                    Key: previousProfileName
                };

                s3.deleteObject(params, (error, data) => {
                    if (error) {
                        console.log(error);
                    }
                })
            }
        } else {
            await User.findByIdAndUpdate(req.params.id, {
                $set: {
                    userName: req.body.userName,
                    email: req.body.email,
                    fName: req.body.fName,
                    lName: req.body.lName,
                    contact: req.body.contact,
                    country: req.body.country,
                    address: req.body.address,
                    updateDate: Date()
                }
            })
        }
        return res.status(200).json({
            status: true,
            msg: "Proflile successfully updated...!",
        })
    } else {
        return res.status(401).json({
            status: false,
            msg: "Something went wrong, Please try again latter...!"
        })
    }
})

module.exports = router;









/* ------------------------- Upload file in local storage ---------------------- */

// const multer = require('multer');
// let fileName;
// const storage = multer.diskStorage({
//     destination: (req, file, cb) => {
//         cb(null, 'ProfilePicture');
//     },
//     filename: (req, file, cb) => {
//         cb(null, fileName = Date.now() + '_' + file.originalname.replace(/ /g, '_'));
//     }
// })
// const upload = multer({ storage: storage });

// upload.single('profile_picture')

// const imagePath = 'http://localhost:3000/ProfilePicture/';

// if (fileName != undefined) {}