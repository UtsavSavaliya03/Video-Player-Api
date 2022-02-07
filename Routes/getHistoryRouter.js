const express = require('express');
const router = express.Router();
const History = require('../Models/HistoryModel');
const User = require('../Models/userModel');
const bodyParser = require('body-parser');

router.use(bodyParser.json());

router.post('/', async (req, res)=>{
    const history = await History.find({user_id: req.body.user_id}).populate({path: 'video_id', populate: {path: 'channel_id', select: ['channelName']}}).sort({"createDate":-1});
    if (history.length < 1) {
        return(
            res.status(200).json({
                status: false,
                msg: "No History found...!"
            })
        )
    } else {
        return(
            res.status(200).json({
                status: true,
                msg: "User's History...!",
                data: history
            })
        )
    }
})

module.exports = router;