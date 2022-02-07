const express = require('express');
const router = express.Router();
const Favourite = require('../Models/favouriteModel');
const bodyParser = require('body-parser');

router.use(bodyParser.json());

router.post('/', async (req, res)=> {
    const favourite = await Favourite.findOne({$and: [{user_id: req.body.user_id}, {video_id: req.body.video_id}]});
    if (favourite != null) {
        res.status(200).json({
            status: true,
            msg: "This video is Available in user's Favourite list...!"
        })
    } else {
        res.status(200).json({
            status: false,
            msg: "This video is not Available in user's Favourite list...!"
        }) 
    }
})

module.exports = router;