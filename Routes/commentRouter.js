const express = require('express');
const router = express.Router();
const Comment = require('../Models/commentModel');
const bodyParser = require('body-parser');

router.use(bodyParser.json());

router.post('/', async  (req, res)=>{

    const comment = new Comment({
        user_id: req.body.user_id,
        channel_id: req.body.channel_id,
        video_id: req.body.video_id,
        cmt_reply_id: null,
        cmt_text: req.body.cmt_text,
        createDate: Date()
    })
    comment.save()
    .then((result)=>{
        res.status(200).json({
            status: true,
            msd: "comment posted successfully...!",
            data: result
        })
    })
    .catch((err)=>{
        console.log(err);
        res.status(401).json({
            status: false,
            msg : "Something went wrong, Please try again latter...!",
            data: err
        })
    })
})

module.exports = router;