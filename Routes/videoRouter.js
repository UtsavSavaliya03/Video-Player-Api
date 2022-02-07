require('dotenv').config();
const express = require('express');
const router = express.Router();
const Video = require('../Models/videoModel');
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

const uploadFile = multer({ storage }).array('file', 2); /* We can upload 2 files */
let videoContent = null;
let thumbnailImage = null;

router.use(bodyParser.json());

router.post('/', uploadFile, async (req, res) => {

    const file = req.files;

    var qtags = [];
    tags = (req.body.tags).split(',')

    for (let i = 0; i < file.length; i++) {
        if (file[i].mimetype == "video/mp4") {
            const myFile = file[i].originalname.split(".");
            const fileType = myFile[myFile.length - 1];
            const fileName = myFile[0].replace(/ /g,"_");
            const params = {
                Bucket: "vdplayer/Media/Videos",
                Key: fileName + "-" + Date.now() + "." + fileType, // pass key
                Body: file[i].buffer, // pass file body
                ACL:'public-read'
            };

            s3.upload(params, (err, data) => {
                if (err) {
                    console.log(err);
                    res.status(500).json({
                        status: false,
                        msg: "We are face trouble to upload your video, Please try again latter...!",
                        data: err
                    })
                } else {
                    videoContent = data.Location;
                    // console.log(videoContent)

                    for (let i = 0; i < file.length; i++) {
                        if (file[i].mimetype == "image/png" || file[i].mimetype == "image/jpg" || file[i].mimetype == "image/jpeg") {
                            const myFile = file[i].originalname.split(".");
                            const fileType = myFile[myFile.length - 1];
                            const fileName = myFile[0].replace(/ /g,"_");
                            const params = {
                                Bucket: "vdplayer/Media/Thumbnails",
                                Key: fileName + "-" + Date.now() + "." + fileType, // pass key
                                Body: file[i].buffer, // pass file body
                                ACL:'public-read'
                            };
                            s3.upload(params, (err, data) => {
                                if (err) {
                                    console.log(err);
                                    res.status(500).json({
                                        status: false,
                                        msg: "We are face trouble to upload your thumbnail image, Please try again latter...!",
                                        data: err
                                    })
                                } else {
                                    thumbnailImage = data.Location;
                                    // console.log(thumbnailImage)

                                    const video = new Video({
                                        user_id: req.body.user_id,
                                        channel_id: req.body.channel_id,
                                        videoContent_link: videoContent,
                                        thumbnailImage_link: thumbnailImage,
                                        videoName: req.body.videoName,
                                        description: req.body.description,
                                        category: req.body.category,
                                        tags: tags,
                                        visibility: req.body.visibility,
                                        createDate: Date()
                                    })
                                    video.save()
                                        .then((result) => {
                                            res.status(200).json({
                                                status: true,
                                                msg: "Video uploaded successfully...!",
                                                data: result
                                            })
                                        })
                                        .catch((err) => {
                                            res.status(401).json({
                                                status: false,
                                                msg: "Something went wrong, Please try again latter...!",
                                                data: err
                                            })
                                        })
                                }
                            });
                        }
                    }
                }
            });
        }
    }
})

module.exports = router;








/* ------------------------- Upload file in local storage ---------------------- */

// const multer = require('multer');
// const fileArray = [];
// const storage = multer.diskStorage({
//     destination: (req, file, cb) => {
//         let dest;
//         if (file.mimetype == "image/png" || file.mimetype == "image/jpg" || file.mimetype == "image/jpeg") {
//             dest = 'Media/Thumbnail';
//         } else {
//             dest = 'Media/Video';
//         }
//         cb(null, dest);
//     },
//     filename: (req, file, cb) => {
//         cb(null, fileName = Date.now() + '_' + file.originalname.replace(/ /g, '_'));
//         fileArray.push(fileName);
//     }
// })
// const upload = multer({storage: storage});
// let fileName;
//
// upload.array("file", 2) ----- function
//
// videoName: videoPath + fileArray[0],
// thumbnail: thumbnailPath + fileArray[1],