const express = require('express');
const router = express.Router();
const Like = require('../Models/likesModel');
const bodyParser = require('body-parser');

router.use(bodyParser.json());

router.post('/', async (req, res)=> {
    const like = await Like.findOne({$and: [{user_id: req.body.user_id}, {video_id: req.body.video_id}]});
    if (like != null) {
        res.status(200).json({
            status: true,
            msg: "This video is Available in user's Liked videos list...!"
        })
    } else {
        res.status(200).json({
            status: false,
            msg: "This video is not Available in user's Liked videos list...!"
        }) 
    }
})

module.exports = router;