const express = require('express');
const router = express.Router();
const Comment = require('../Models/commentModel');
const bodyParser = require('body-parser');

router.use(bodyParser.json());

router.post('/', (req, res)=>{

    function randomString(length) {
        const str = Math.round((Math.pow(36, length + 1) - Math.random() * Math.pow(36, length))).toString(36).slice(1);
        return str.toUpperCase()
    }

    function generateId() {
        const date = Date.now().toString();
        const str = date.substr(6, 4);
        return randomString(2) + str + randomString(2)
    }

    const comment = new Comment({
        user_id: req.body.user_id,
        channel_id: req.body.channel_id,
        video_id: req.body.video_id,
        cmt_id: generateId(),
        cmt_reply_id: req.body.cmt_reply_id,
        cmt_text: req.body.cmt_text
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
        })
    }) 
})

module.exports = router;