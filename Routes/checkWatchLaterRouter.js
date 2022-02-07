const express = require('express');
const router = express.Router();
const WatchLater = require('../Models/watchLaterModel');
const bodyParser = require('body-parser');

router.use(bodyParser.json());

router.post('/', async (req, res) => {
    const watchLater = await WatchLater.findOne({$and: [{user_id: req.body.user_id}, {video_id: req.body.video_id}]});
    if (watchLater != null) {
        res.status(200).json({
            status: true,
            msg: "This video is Available in user's Watchlater list...!"
        })
    } else {
        res.status(200).json({
            status: false,
            msg: "This video is not Available in user's Watchlater list...!"
        }) 
    }
});

module.exports = router;