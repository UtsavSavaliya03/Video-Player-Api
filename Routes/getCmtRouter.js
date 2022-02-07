const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const Comment = require('../Models/commentModel');

router.use(bodyParser.json());

router.post('/', async (req, res) => {
    await Comment.find({ $and: [{ video_id: req.body.video_id }, { cmt_reply_id: null }] }).populate({path: 'user_id', select:["fName", "lName", "profile_picture"]}).sort({"createDate": -1})
        .then((cmt) => {
            if (cmt.length < 1) {
                return (
                    res.status(200).json({
                        status: false,
                        msg: "No comments...!"
                    })
                );
            } else {
                return (
                    res.status(200).json({
                        status: true,
                        msg: "All comments of this video",
                        data: cmt
                    })
                );
            }
        })
        .catch((err) => {
            console.log(err);
            res.status(401).json({
                status: false,
                msg: "Something went wrong, Please try again latter...!"
            })
        });
})

module.exports = router;