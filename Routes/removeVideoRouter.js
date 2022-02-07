require('dotenv').config();
const express = require('express');
const router = express.Router();
const Video = require('../Models/videoModel');
const History = require('../Models/HistoryModel');
const Favourite = require('../Models/favouriteModel');
const WatchLater = require('../Models/watchLaterModel');
const Like = require('../Models/likesModel');
const AWS = require('aws-sdk');

const s3 = new AWS.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_KEY,
})

router.post('/:id', async (req, res) => {
    const video = await Video.findById(req.params.id);

    if (video == null) {
        return (
            res.status(401).json({
                status: false,
                msg: "Something went wrong, Please try again latter...!"
            })
        );
    } else {
        const videoPath = (video.videoContent_link).split("/");
        const thumbnailPath = (video.thumbnailImage_link).split("/");
        const videoName = videoPath[videoPath.length - 1];
        const thumbnailName = thumbnailPath[thumbnailPath.length - 1];

        const videoParams = {
            Bucket: "vdplayer/Media/Videos",
            Key: videoName
        }

        /* ----- Delete Video from AWS ----- */
        s3.deleteObject(videoParams, async (error, data) => {
            if (error) {
                console.log(error);
                res.status(401).json({
                    status: false,
                    msg: "We are face trouble to delete your video, Please try again latter...!"
                })
            } else {
                const thumbnailParams = {
                    Bucket: "vdplayer/Media/Thumbnails",
                    Key: thumbnailName
                }

                /* ----- Delete Thumbnail from AWS ----- */
                s3.deleteObject(thumbnailParams, async (error, data) => {
                    if (error) {
                        console.log(error);
                        res.status(401).json({
                            status: false,
                            msg: "We are face trouble to delete your Thumbnail Image, Please try again latter...!"
                        })
                    } else {
                        await Video.findByIdAndRemove(req.params.id)
                            .then( async (result) => {
                                await History.deleteMany({video_id: req.params.id});
                                await Favourite.deleteMany({video_id: req.params.id});
                                await WatchLater.deleteMany({video_id: req.params.id});
                                await Like.deleteMany({video_id: req.params.id});
                                res.status(200).json({
                                    status: true,
                                    msg: "Video deleted successfully...!",
                                })
                            })
                            .catch((error) => {
                                console.log(error);
                                res.status(401).json({
                                    status: false,
                                    msg: "Something went wrong, Please try again letter...!",
                                    data: error
                                })
                            })
                    }
                })
            }
        })
    }
})

module.exports = router;