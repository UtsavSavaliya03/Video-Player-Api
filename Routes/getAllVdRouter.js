const express = require('express');
const router = express.Router();
const Videos = require('../Models/videoModel');
const bodyParser = require('body-parser');

router.use(bodyParser.json());

function shuffle(array) {
    let currentIndex = array.length, randomIndex;

    while (currentIndex != 0) {

        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;

        [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
    }

    return array;
}

router.post('/', async (req, res) => {
    await Videos.find().populate({ path: "channel_id", select: ["channelName", "channel_profile"] }).sort({ "createDate": -1 })
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
                data: shuffle(result)
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