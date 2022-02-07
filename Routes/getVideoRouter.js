const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const Videos = require('../Models/videoModel');
const { route } = require('./signupRouter');

router.use(bodyParser.json());

router.post('/:id', async (req, res) => {
    await Videos.findById(req.params.id).populate({ path: "channel_id", select: ["channelName", "channel_profile"] })
        .then((video) => {
            res.status(200).json({
                status: true,
                data: video
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