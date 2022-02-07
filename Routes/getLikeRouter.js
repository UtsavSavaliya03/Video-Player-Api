const express = require('express');
const router = express.Router();
const Like = require('../Models/likesModel');
const bodyParser = require('body-parser');

router.use(bodyParser.json());

router.post('/', async (req, res) => {
    const like = await Like.find({ video_id: req.body.video_id });
    const numberOfLike = await Like.find({ video_id: req.body.video_id }).count({});

    if (like.length < 1) {
        return (
            res.status(401).json({
                status: false,
                msg: "No Likes ...!"
            })
        )
    } else {
        return (
            res.status(200).json({
                status: true,
                data: {
                    likes: numberOfLike,
                    data: like
                }
            })
        );
    }
})

module.exports = router;