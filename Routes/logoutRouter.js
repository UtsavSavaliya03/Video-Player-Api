const express = require('express');
const router = express.Router();
const bodyParser = require("body-parser");
const User = require('../Models/userModel');

router.use(bodyParser.json());

router.post('/', async (req, res) => {
    const user = await User.findById(req.body.user_id);

    var updatedToken = (user.token).filter((currElement) => {
        return currElement != req.body.token
    });

    if (req.body.logoutAll) {
        await User.findByIdAndUpdate(user._id, {
            $set: {
                token: []
            }
        })
            .then((result) => {
                res.status(200).json({
                    status: true,
                    msg: "All User logout successfully...!"
                })
            })
            .catch((error) => {
                console.log(error);
                res.status(401).json({
                    status: false,
                    msg: "Something went wrong, Please try again latter...!",
                    data: error
                })
            })
    } else {
        await User.findByIdAndUpdate(user._id, {
            $set: {
                token: updatedToken
            }
        })
            .then((result) => {
                res.status(200).json({
                    status: true,
                    msg: "User logout successfully...!"
                })
            })
            .catch((error) => {
                console.log(error);
                res.status(401).json({
                    status: false,
                    msg: "Something went wrong, Please try again latter...!",
                    data: error
                })
            })
    }
})

module.exports = router;