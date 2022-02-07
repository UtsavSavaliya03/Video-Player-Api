const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const User = require('../Models/userModel');

router.use(bodyParser.json());

router.post('/:id', async (req, res) => {
    await User.findById(req.params.id)
    .then((user)=>{
        if (user == null) {
            return res.status(401).json({
                status: false,
                msg: "No user found...!"
            })
        }
        return res.status(200).json({
            status: true,
            data: user
        })
    })
    .catch((err)=>{
        res.status(401).json({
            status: false,
            msg: "Something went wrong, Please try again latter...!",
            data: err
        })
    })
})

module.exports = router;