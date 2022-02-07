const express = require('express');
const router = express.Router();
const History = require('../Models/HistoryModel');
const bodyParser = require("body-parser");

router.use(bodyParser.json());

router.post('/', async (req, res) => {
    const video = await History.find({ user_id: req.body.user_id });
    if (video.length < 1) {
        return (
            res.status(401).json({
                status: false,
                msg: "No videos yet...!"
            })
        );
    } else {
        await History.deleteMany({ user_id: req.body.user_id })
            .then((result) => {
                res.status(200).json({
                    status: true,
                    msg: "All Histories Cleared...!"
                })
            })
            .catch((err) => {
                console.log(err);
                res.status(401).json({
                    status: false,
                    msg: "Something went wrong, Please try again latter...!"
                })
            })
    }
})

module.exports = router;