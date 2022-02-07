const express = require('express');
const router = express.Router();
const Channel = require('../Models/channelModel');

router.post('/:id', async (req, res)=>{
    await Channel.findById(req.params.id)
    .then((result)=>{
        res.status(200).json({
            status: true,
            data: result
        })
    })
    .catch((err)=>{
        res.status(401).json({
            status: false,
            msg: "Something went wrong, Please try again letter...!",
            data: err
        })
    })
});

module.exports = router;