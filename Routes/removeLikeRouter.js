const express = require('express');
const router = express.Router();
const Like = require('../Models/likesModel');
const bodyParser = require('body-parser');

router.use(bodyParser.json());

router.post('/', async (req, res)=>{
    await Like.findOneAndDelete({$and: [{user_id: req.body.user_id}, {video_id: req.body.video_id}]})
    .then((result)=>{
        res.status(200).json({
            status: true,
            msg: "Unliked...!"
        })
    })
    .catch((err)=>{
        console.log(err);
        res.status(401).json({
            status: false,
            msg: "Something went wrong, Please try again latter...!"
        })
    })
})

module.exports = router;