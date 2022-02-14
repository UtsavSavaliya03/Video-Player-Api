const express = require('express');
const router = express.Router();
const Video = require('../Models/videoModel');

router.post('/:name', (req, res) => {
    var regex = new RegExp(req.params.name, 'i');
    Video.find({$and: [{ videoName: regex }, {visibility:"Public"}]}).populate({path: "channel_id", select: ["channelName", "channel_profile"]})
        .then((result) => {
            res.status(200).json({
                status: true,
                data: result
            })
        })
        .catch((error) => {
            console.log(error);
            res.status(401).json({
                status: false,
                msg: "Something went rong, Please try again later...!",
                data: error
            })
        })
})

module.exports = router;