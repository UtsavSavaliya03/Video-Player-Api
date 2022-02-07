const express = require('express');
const router = express.Router();
const Like = require('../Models/likesModel');
const bodyParser = require('body-parser');

router.use(bodyParser.json());

router.post('/', async (req, res)=>{
    const like = await Like.find({user_id: req.body.user_id}).populate({path: 'video_id', populate: {path: 'channel_id', select: ['channelName']}}).sort({"createDate": -1});

    if (like.length < 1) {
        return (
            res.status(401).json({
                status: false,
                msg: "No Likes ...!"
            })
        );
    } else {
        return (
            res.status(200).json({
                status: true,
                data: like
            })
        );
    }
})

module.exports = router;