const express = require('express');
const router = express.Router();
const Video = require('../Models/videoModel');

router.post('/:category', async (req, res) => {

    function shuffle(array) {
        let currentIndex = array.length, randomIndex;

        while (currentIndex != 0) {

            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex--;

            [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
        }

        return array;
    }

    await Video.find({ category: req.params.category }).populate({ path: "channel_id", select: ["channelName", "channel_profile"] }).sort({ "createDate": -1 })
        .then((result) => {
            if (result.length > 1) {
                res.status(200).json({
                    status: true,
                    msg: `Video of ${req.params.category} category...!`,
                    data: shuffle(result)
                })
            } else {
                res.status(401).json({
                    status: false,
                    msg: "No Videos...!"
                })
            }
        })
        .catch((error) => {
            console.log(error);
            res.status(401).json({
                status: false,
                msg: "Something went wrong, Please try again letter...!",
                data: error
            })
        })
})

module.exports = router;