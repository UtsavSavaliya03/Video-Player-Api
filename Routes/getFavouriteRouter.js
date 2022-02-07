const express = require('express');
const router = express.Router();
const Favourite = require('../Models/favouriteModel');
const bodyParser = require('body-parser');

router.use(bodyParser.json());

router.post('/', async (req, res) => {
    const favourite = await Favourite.find({ user_id: req.body.user_id }).populate({path: 'video_id', populate: {path: 'channel_id', select: ['channelName']}}).sort({"createDate":-1});
        if (favourite.length < 1) {
            return (
                res.status(401).json({
                    status: false,
                    msg: "No favourite videos found...!"
                })
            )
        } else {
            return (
                res.status(200).json({
                    status: true,
                    msg: "User's Favourite...!",
                    data: favourite
                })
            )
        }
    })

    module.exports = router;