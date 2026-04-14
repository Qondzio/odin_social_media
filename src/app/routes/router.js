const {Router}=require('express');
const route=Router();
const controller=require('../controllers/controller.js');
const validator=require('../controllers/validator.js');
const multer  = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage });



route.post("/api/login", controller.loginUser);
route.post("/api/signup", validator.validateSignUp, controller.signUpUser);
route.post("/api/forgot-password", controller.forgotPassword);
route.post('/api/reset-password/:token', validator.validateNewPassword, controller.resetPassword);
route.post('/api/upload-file/', upload.single('file'), controller.uploadFile);
route.post('/api/follow-user/:userId', controller.followUser);
route.post('/api/unfollow-user/:userId', controller.unfollowUser);
route.post('/api/create-post', upload.single('file'), controller.createPost);
route.post('/api/like-post/:postId', controller.likePost);
route.post('/api/unlike-post/:postId', controller.unlikePost);
route.post('/api/comment-post/:postId', controller.commentPost);
route.post('/api/like-comment/:commentId', controller.likeComment);
route.post('/api/unlike-comment/:commentId', controller.unlikeComment);
route.post('/api/createMessage', controller.createMessage);
route.get('/api/reset-token/:token', controller.checkToken);
route.get('/api/checkIfLogged', controller.checkIfLogged);
route.get('/api/find-user/:user', controller.findUser);
route.get('/api/find-user-data/:userId', controller.findUserData);
route.get('/api/get-posts-by-id/:userId', controller.getPostsByUserId);
route.get('/api/get-posts-reactions/:postId', controller.getPostReactions);
route.get('/api/get-single-post/:postId', controller.getSinglePost);
route.get('/api/get-all-posts', controller.getRecentPosts);
route.get('/api/get-following-posts', controller.getFollowingPosts);
route.get('/api/get-messages/:userId', controller.getMessages);
route.get('/api/userConversations/:userId', controller.userConversations);
route.get('/api/conversationRead/:conversationId', controller.conversationRead);
route.get('/api/getNotifications', controller.getNotifications);
route.get("/api/log-out", (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    res.status(200).json('Looged out')
  });
});


module.exports=route;