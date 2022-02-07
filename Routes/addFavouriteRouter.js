const express = require('express');
const router = express.Router();
const Favourite = require('../Models/favouriteModel');
const bodyParser = require('body-parser');

router.use(bodyParser.json());

router.post('/', async (req, res) => {

    const video = await Favourite.findOne({ $and: [{ user_id: req.body.user_id }, { video_id: req.body.video_id }] });

    if (video != null) {
        return (
            res.status(200).json({
                status: true,
                msg: "This video is already in your collection...!",
            })
        )
    } else {

        const favourite = new Favourite({
            user_id: req.body.user_id,
            video_id: req.body.video_id,
            createDate: Date()
        })
        favourite.save()
            .then((result) => {
                res.status(200).json({
                    status: true,
                    msg: "Added successfully...!"
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