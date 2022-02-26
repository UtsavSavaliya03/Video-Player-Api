const express = require('express');
const router = express.Router();
const User = require('../Models/userModel');

router.post('/:id', async (req, res) => {
    await User.findById(req.params.id)
        .then((result) => {
            return (
                res.status(200).json({
                    status: true,
                    msg: "User's token...!",
                    data: result.token
                })
            )
        })
        .catch((error) => {
            console.log(error);
            return (
                res.status(401).json({
                    status: false,
                    msg: "Something went wrong, Please try again latter...!",
                    data: error
                })
            )
        })
})

module.exports = router;