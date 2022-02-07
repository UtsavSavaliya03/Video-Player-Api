const express = require('express');
const router = express.Router();
const Like = require('../Models/likesModel');
const Video = require('../Models/videoModel');
const bodyParser = require('body-parser');

router.use(bodyParser.json());

router.post('/', async (req, res)=>{
    const like = await Like.findOne({$and: [{user_id: req.body.user_id}, {video_id: req.body.video_id}]});

    if (like != null) {
        return (
            res.status(200).json({
                status: true,
                msg: "You already liked this video...!"
            })
        )
    } else {

        const like = new Like({
            user_id: req.body.user_id,
            video_id: req.body.video_id,
            createDate: Date() 
        })
        like.save()
            .then((result) => {
                res.status(200).json({
                    status: true,
                    msg: "Liked...!"
                })
            })
            .catch((err) => {
                console.log(err);
                res.status(401).json({
                    status: false,
                    msg: "Something went wrong, Please try again letter...!",
                    data: err
                })
            })
    }
})

module.exports = router;