const express = require('express');
const router = express.Router();
const Channel = require('../Models/channelModel');
const bodyParser = require('body-parser');

router.use(bodyParser.json());

router.post('/', async (req, res) => {
    const channel = await Channel.findOne({ user_id: req.body.user_id });
    if (channel === null) {
        return (
            res.status(200).json({
                status: true,
                msg: "User have no channel...!"
            })
        );
    } else {
        return (
            res.status(200).json({
                status: true,
                msg: "User's Channel...!",
                data: channel
            })
        );
    }
})

module.exports = router;