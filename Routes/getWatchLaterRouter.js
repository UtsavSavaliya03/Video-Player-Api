const express = require('express');
const router = express.Router();
const WatchLater = require('../Models/watchLaterModel');
const bodyParser = require('body-parser');

router.use(bodyParser.json());

router.post('/', async (req, res)=>{
    const watchLater = await WatchLater.find({user_id: req.body.user_id}).populate({path: 'video_id', populate: {path: 'channel_id', select: ['channelName']}}).sort({"createDate":-1});
    if (watchLater.length < 1) {
        return(
            res.status(401).json({
                status: false,
                msg: "No Videos found...!"
            })
        )
    } else {
        return(
            res.status(200).json({
                status: true,
                data: watchLater
            })
        )
    }
})

module.exports = router;