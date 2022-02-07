const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const Comment = require('../Models/commentModel');

router.use(bodyParser.json());

router.post('/', async (req, res) => {
    await Comment.find({ cmt_reply_id: req.body.cmt_reply_id })
        .then((cmt) => {
            if (cmt.length < 1) {
                res.status(401).json({
                    status: false,
                    msg: "No comments"
                })
            } else {
                res.status(200).json({
                    status: true,
                    msg: "All replies of this comments",
                    data: cmt
                })
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