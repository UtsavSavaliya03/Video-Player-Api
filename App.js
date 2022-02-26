require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const App = express();

const signupRouter = require('./Routes/signupRouter');
const loginRouter = require('./Routes/loginRouter');
const getUserRouter = require('./Routes/getUserRouter');
const getUserTokenRouter = require('./Routes/getUserTokenRouter');
const logoutRouter = require('./Routes/logoutRouter');

// User
const updateProfileRouter = require('./Routes/updateProfileRouter');
const passRecoveryRouter = require('./Routes/passRecoveryRouter');
const resetPassRouter = require('./Routes/resetPassRouter');

// Channel
const createChannelRouter = require('./Routes/channelRouter');
const updateChannelRouter = require('./Routes/updateChannelRouter');
const getChannelRouter = require('./Routes/getChannelRouter');
const getUserChannelRouter = require('./Routes/getUserChannelRouter');

// Videos
const videoUploadRouter = require('./Routes/videoRouter');
const getVideoRouter = require('./Routes/getVideoRouter');
const getAllVdRouter = require('./Routes/getAllVdRouter');
const getChannelVdRouter = require('./Routes/getChannelVdRouter');
const removeVideoRouter = require('./Routes/removeVideoRouter');
const getCategoryVdRouter = require('./Routes/getCategoryVdRouter');
const addViewRouter = require('./Routes/addViewRouter');

// Comments
const commentRouter = require('./Routes/commentRouter');
const replyCmtRouter = require('./Routes/replyCmtRouter');
const getCmtRouter = require('./Routes/getCmtRouter');
const getReplyCmtRouter = require('./Routes/getReplyCmtRouter');

// History
const addHistoryRouter = require('./Routes/addHistoryRouter');
const getHistoryRouter = require('./Routes/getHistoryRouter');
const removeHistoryRouter = require('./Routes/removeHistoryRouter');
const removeAllHistoryRouter = require('./Routes/removeAllHistoryRouter');

// Favourite
const addWatchLaterRouter = require('./Routes/addWatchLaterRouter');
const getWatchLaterRouter = require('./Routes/getWatchLaterRouter');
const removeFavouriteRouter = require('./Routes/removeFavouriteRouter');
const removeAllFavouriteRouter = require('./Routes/removeAllFavouriteRouter');
const checkFavouriteRouter = require('./Routes/checkFavouriteRouter');

// Watch Later
const addFavouriteRouter = require('./Routes/addFavouriteRouter');
const getFavouriteRouter = require('./Routes/getFavouriteRouter');
const removeWatchLaterRouter = require('./Routes/removeWatchLaterRouter');
const removeAllWatchLaterRouter = require('./Routes/removeAllWatchLaterRouter');
const checkWatchLaterRouter = require('./Routes/checkWatchLaterRouter');

// Like
const addLikeRouter = require('./Routes/addLikeRouter');
const getLikeRouter = require('./Routes/getLikeRouter');
const getUserLikeRouter = require('./Routes/getUserLikeRouter');
const removeLikeRouter = require('./Routes/removeLikeRouter');
const checkLikeRouter = require('./Routes/checkLikeRouter');

// Search
const searchVideo = require('./Routes/searchVideoRouter');

const DB = `mongodb+srv://${process.env.MONGODB_CLUSTER_ID}:${process.env.MONGODB_CLUSTER_PASS}@cluster0.syvn5.mongodb.net/video_player?retryWrites=true&w=majority`;

mongoose.connect( DB , {
    useNewUrlParser: true,  
    useUnifiedTopology: true
})
.then(()=>{
    console.log("MongoDb Connected...!");
}).catch((err)=>{
    console.log(err);
})

App.use(cors());

// User Signup
App.use('/signup', signupRouter); 

// User Login
App.use('/login', loginRouter); 

// Get User Details
App.use('/getUser', getUserRouter);

// Get user's token
App.use('/getUserToken', getUserTokenRouter);

// Logout User
App.use('/logout', logoutRouter);

// User
App.use('/updateProfile', updateProfileRouter);     // Update User profile
App.use('/sendEmail', passRecoveryRouter);      // Send Mail for password recovery
App.use('/resetPassword', resetPassRouter);     // Reset password

// Channel
App.use('/createChannel', createChannelRouter);     // Create channel
App.use('/updateChannel', updateChannelRouter);     // Update channel
App.use('/getUserChannel', getUserChannelRouter)    // Get User's Channel --- By user id
App.use('/getChannel', getChannelRouter)    // Get User's Channel --- By channel id

// Videos
App.use('/uploadVideo', videoUploadRouter);     // Upload video 
App.use('/getVideo', getVideoRouter);       // Get video
App.use('/getAllVd', getAllVdRouter);       // Get All videos
App.use('/getChannelVd', getChannelVdRouter);       // Get particular channel's Videos
App.use('/removeVideo', removeVideoRouter);     // Remove Video from channel
App.use('/categoryVd', getCategoryVdRouter)     // Get category wise videos
App.use('/addView', addViewRouter);        // Add Video's Views

// Comments
App.use('/postComment', commentRouter);     // Post a Comment
App.use('/replyComment', replyCmtRouter);       // Reply any comment
App.use('/getComment', getCmtRouter);       // Get comment of videos
App.use('/getReplyCmt', getReplyCmtRouter);     // Get reply of any comment

// History
App.use('/addHistory', addHistoryRouter);       // Add User History
App.use('/getHistory', getHistoryRouter);       // Get User's History
App.use('/removeHistory', removeHistoryRouter);      // Remove User's History
App.use('/removeAllHistory', removeAllHistoryRouter);       // Remove User's all History

// Favourite
App.use('/addFavourite', addFavouriteRouter);       // Add Favourite
App.use('/getFavourite', getFavouriteRouter);       // Get Favourite
App.use('/removeFavourite', removeFavouriteRouter);     // Remove Favourite
App.use('/removeAllFavourite', removeAllFavouriteRouter);       // Remove all Favourite
App.use('/checkFavourite', checkFavouriteRouter)      // Check Favourite Videos

// Watch Later
App.use('/addWatchLater', addWatchLaterRouter);     // Add Watch later video
App.use('/getWatchLater', getWatchLaterRouter);     // Get Watch later video
App.use('/removeWatchLater', removeWatchLaterRouter);       // Remove Watch later video
App.use('/removeAllWatchLater', removeAllWatchLaterRouter);     // Remove all Watch later video
App.use('/checkWatchLater', checkWatchLaterRouter)      // Check Watchlater Videos

// Like
App.use('/addLike', addLikeRouter);     // Add Like     
App.use('/getLike', getLikeRouter);     // Get Like
App.use('/getUserLike', getUserLikeRouter);     // Get particular User's Like
App.use('/removeLike', removeLikeRouter);       // Remove Like
App.use('/checkLike', checkLikeRouter)      // Check Liked Videos

// Search
App.use('/searchVideo', searchVideo);       // Search Videos

// Error handler 
App.use('/', (req, res) => {
    res.status(404).json({
        status: false,
        msg: 'Bad request...'
    })
}) 

module.exports = App;