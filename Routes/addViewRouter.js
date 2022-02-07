const express = require('express');
const router = express.Router();
const Video = require('../Models/videoModel');
const bodyParser = require('body-parser');

router.use(bodyParser.json());

router.post('/:id', async (req, res) => {

    let user_id = req.body.user_id == undefined ? `unloggedUser_${Date.now()}` : req.body.user_id;

    await Video.findOneAndUpdate({_id :req.params.id}, {
        $push: {
            views: user_id
        }
    })
        .then((result) => {
            res.status(200).json({
                status: true,
                msg: "View Counted...!"
            })
        })
        .catch((error) => {
            console.log(error);
            res.status(401).json({
                status: false,
                msg: "Something went wrong, Please try again letter...!",
                data: error
            })
        })
});

module.exports = router;