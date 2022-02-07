const express = require('express');
const router = express.Router();
const Favourite = require('../Models/favouriteModel');
const bodyParser = require("body-parser");

router.use(bodyParser.json());

router.post('/', async(req, res) => {
    const video = await Favourite.find({ user_id: req.body.user_id });
    if(video.length < 1) {
    return (
        res.status(401).json({
            status: false,
            msg: "No favvourite videos yet...!"
        })
    );
} else {
    await Favourite.deleteMany({ user_id: req.body.user_id })
        .then((result) => {
            res.status(200).json({
                status: true,
                msg: "All videos removed successfully...!"
            })
        })
        .catch((err) => {
            console.log(err);
            res.status(401).json({
                status: false,
                msg: "Something went wrong, Please try again latter...!"
            })
        })
}
})

module.exports = router;