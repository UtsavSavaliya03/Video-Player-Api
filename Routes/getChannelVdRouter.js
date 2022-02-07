const express = require('express');
const router = express.Router();
const Videos = require('../Models/videoModel');
const bodyParser = require('body-parser');

router.use(bodyParser.json());

router.post('/', async (req, res) => {
    await Videos.find({ channel_id: req.body.channel_id }).populate({path: 'channel_id', select:['channelName']}).sort({"createDate":-1})
        .then((result) => {
            if (result.length < 1) {
                return res.status(401).json({
                    status: false,
                    msg: "No videos yet...!"
                })
            }
            res.status(200).json({
                status: true,
                msg: "All videos of this channel...!",
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
})

module.exports = router;