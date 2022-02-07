const express = require('express');
const router = express.Router();
const History = require('../Models/HistoryModel');
const bodyParser = require('body-parser');

router.use(bodyParser.json());

router.post('/', (req, res)=>{
    const history = new History({
        user_id: req.body.user_id,
        video_id: req.body.video_id,
        createDate: Date()
    })
    history.save()
    .then((result)=>{
            res.status(200).json({
                status: true,
                msg: "History saved successfully...!"
            })
    })
    .catch((err)=>{
        console.log(err);
        res.status(401).json({
            status: false,
            msg: "Something went wrong, Please try again letter...!",
            data: err
        })
    })
})

module.exports = router;