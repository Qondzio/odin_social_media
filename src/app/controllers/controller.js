const query=require('../../../prisma/queries.js');
const bcrypt = require("bcryptjs");
const passport=require('../passport.js');
const mailer=require('./mailer.js');
const { validationResult, matchedData } = require("express-validator");
const crypto = require('crypto');
const {cloudinary}=require('../../../cloudinary/cloudinary-config.js');
const {io} = require('../app.js');

async function signUpUser(req,res){
    const errors=validationResult(req);
    if(!errors.isEmpty()){
      return res.status(400).json({errors: errors.array()});
    }
    const { name, lastName, date, email, password } = matchedData(req);
    const hashedPassword=await bcrypt.hash(password, 10);
    await query.insertData(name, lastName, date, email, hashedPassword);
    res.json('user created');
}

async function loginUser(req, res, next){  
  passport.authenticate("local", (err, user, info) => {

    if (err) return next(err);

    if (!user) {
      return res.status(401).json({ message: info });
    }

    req.logIn(user, err => {
      if (err) return next(err);
      return res.json({ message: "Logged in" });
    });

  })(req, res, next);
}

async function forgotPassword(req, res){
  function emailNotFound(res){
    return res.status(400).json({error: "E-mail address not found. Please check if it is correct."})
  }
  
  if(req.body.email){
    const user=await query.checkCredentials(req.body.email);
    if(!user){
      return emailNotFound(res);
    }
    else{
      const randomToken=crypto.randomBytes(32).toString('hex');
      const hashedToken=crypto.createHash('sha256').update(randomToken).digest('hex');  
      mailer.sendEmail(user.email,randomToken,hashedToken);
      await query.setToken(user.email, hashedToken);
      return res.status(200).json();
    }
  }
  else{
    return emailNotFound(res);
  }
}

async function resetPassword(req,res){  
    const errors=validationResult(req);
    if(!errors.isEmpty()){
      return res.status(400).json({errors: errors.array()});
    }
    const { password } = matchedData(req);
    const hashedPassword=await bcrypt.hash(password, 10);
    const hashedToken=crypto.createHash('sha256').update(req.params.token).digest('hex');
    await query.resetPassword(hashedToken, hashedPassword);
    return res.status(200).json();
}

async function checkToken(req,res){      
  const hashedToken=crypto.createHash('sha256').update(req.params.token).digest('hex');
  const result=await query.checkToken(hashedToken);
  
  if(!result || result.tokenExpiry < new Date()){
    return res.status(400).json();
  }
  else{
    return res.status(200).json();
  }
  
}

async function checkIfLogged(req,res){
  
  if(req.user) return res.status(200).json(req.user);
  else return res.status(401).json({message: "User not logged in."});

}

async function uploadFile(req,res){
  try {
    const file=req.file;  
    const base64 = `data:${file.mimetype};base64,${file.buffer.toString('base64')}`;
    const result=await cloudinary.uploader.upload(base64,{
      folder: 'social_media'
    });
    await query.uploadFile(result.secure_url, req.user.userId);
    return res.status(200).json({message: 'Files uploaded'});

  } catch (error) {
      return res.status(400).json({message: error})
  }
}

async function findUser(req,res){
  const result= await query.checkFindUser(req.params.user);
  
  if(result.length === 0) return res.status(404).json({message: 'No user found'});
  
  return res.status(200).json(result);
}

async function findUserData(req,res){
  const userId=parseInt(req.params.userId);
  const result= await query.findUserData(userId);
  if(!result) return res.status(404).json({message: "No user found"});
  return res.status(200).json(result);
}

async function followUser(req,res){
  const follower=req.user.userId;
  const following=parseInt(req.params.userId);
  try {
      await query.followUser(follower,following); 
      await query.createNotification(following, follower, 'FOLLOW');
      return res.status(200).json({message: "User followed"})
  } catch (error) {
    return res.status(400).json({message: 'Error following user'})
  }
  
}

async function unfollowUser(req,res){
  const follower=req.user.userId;
  const following=parseInt(req.params.userId);
  try {
      await query.unfollowUser(follower,following);
      await query.deleteNotification(following, follower, 'FOLLOW');
      return res.status(200).json({message: "User unfollowed"})
  } catch (error) {
    return res.status(400).json({message: 'Error unfollowing user'})
  }
}

async function createPost(req,res){
  try {
    let image=null;
    if(req.file){
      const file=req.file;  
      const base64 = `data:${file.mimetype};base64,${file.buffer.toString('base64')}`;
      const result=await cloudinary.uploader.upload(base64,{
      folder: 'social_media'
      });      
      image=result.secure_url;
    }        
    await query.createPost(req.body.text, image, req.user.userId);
    
    return res.status(200).json({message: 'Post added'});

  } catch (error) {
      console.log(error);
      return res.status(400).json({message: error})
  }
  
}

async function getPostsByUserId(req,res){
  try {
    const result = await query.getPostsByUserId(parseInt(req.params.userId));
    return res.status(200).json(result);

  } catch (error) {
      return res.status(400).json({message: error})
  }  
}

async function likePost(req,res){
  try {
      const result=await query.likePost(req.user.userId, parseInt(req.params.postId));
      await query.createNotification(result.post.userId, req.user.userId, 'POST-LIKE', result.postId);
      
      return res.status(200).json({message: "You liked that post"});
  } catch (error) {
      console.log(error);
      return res.status(400).json({message: error})
  }
}

async function unlikePost(req,res){
  try {
      const result=await query.unlikePost(req.user.userId, parseInt(req.params.postId));
      await query.deleteNotification(result.post.userId, req.user.userId, 'POST-LIKE', result.postId);
      
      return res.status(200).json({message: "You unliked that post"});
  } catch (error) {
      console.log(error);
      return res.status(400).json({message: error})
  }
}

async function getPostReactions(req,res){
  try {
    const result=await query.getPostReactions(parseInt(req.params.postId));
    
    return res.status(200).json({message: result});
  } catch (error) {
    console.log(error);
    return res.status(400).json({message: error})
  }
}

async function commentPost(req,res){
  try {
    const result=await query.commentPost(req.user.userId, parseInt(req.params.postId), req.body.content, req.body.parentId || null);
    result.parentId ? 
    await query.createNotification(result.post.userId, result.userId, 'COMMENT-COMMENT', result.postId, result.id)
    :
    await query.createNotification(result.post.userId, result.userId, 'POST-COMMENT', result.postId, result.id);
    
    return res.status(200).json({message: "Post commented"});
  } catch (error) {
    console.log(error);
    return res.status(400).json({message: error})
  }
}

async function getSinglePost(req,res){
  try {
    const result=await query.getSinglePost(parseInt(req.params.postId));

    return res.status(200).json({message: result});
  } catch (error) {
    console.log(error);
    return res.status(400).json({message: error})
  }
}

async function likeComment(req,res){
  try {    
    const result=await query.likeComment(req.user.userId, parseInt(req.params.commentId));
    await query.createNotification(result.comment.userId, result.userId, 'LIKE-COMMENT', result.comment.postId, result.commentId);    
    
    return res.status(200).json({message: "Comment liked"});
  } catch (error) {
    console.log(error);
    return res.status(400).json({message: error})
  }
}

async function unlikeComment(req,res){
  try {    
    const result=await query.unlikeComment(req.user.userId, parseInt(req.params.commentId));
    await query.deleteNotification(result.comment.userId, result.userId, 'LIKE-COMMENT', result.comment.postId, result.commentId);
    
    return res.status(200).json({message: "Comment unliked"});
    
  } catch (error) {
    console.log(error);
    return res.status(400).json({message: error})
  }
}

async function getRecentPosts(req,res){
  try {
    const result=await query.getRecentPosts();
    return res.status(200).json({message: result});  

  } catch (error) {
    console.log(error);
    return res.status(400).json({message: error})
  }
}

async function getFollowingPosts(req,res){
  try {
    const result=await query.getFollowingPosts(req.user.userId);
    console.log(result);
    
    return res.status(200).json({message: result});  

  } catch (error) {
    console.log(error);
    return res.status(400).json({message: error})
  }
}

async function getMessages(req,res){
  try {    
    const result=await query.getMessages(req.user.userId, parseInt(req.params.userId));
    
    return res.status(200).json(result); 
  } catch (error) {
    console.log(error);
    return res.status(400).json({message: error})
  }
}

async function createMessage(req,res) {
  try {        
    const result=await query.createMessage(req.user.userId, parseInt(req.body.messageId), req.body.content);    
    
    result.participants.forEach(item=>{
      if(item.userId !== result.senderId){
        io.to(`user:${item.userId}`).emit('newMessage', result)
      };
    })

    return res.status(200).json(result); 
  } catch (error) {
    console.log(error);
    return res.status(400).json({message: error})
  }
}

async function userConversations(req,res){
  try {    
    const result=await query.userConversations(req.user.userId, parseInt(req.params.userId));
    
    return res.status(200).json(result); 
  } catch (error) {
    console.log(error);
    return res.status(400).json({message: error})
  }
}

async function conversationRead(req,res){
  try {
    
    const result= await query.conversationRead(req.user.userId, parseInt(req.params.conversationId));
    console.log(result);
    
    return res.status(200).json(result); 
  } catch (error) {
    console.log(error);
    return res.status(400).json({message: error})
  }
}

async function getNotifications(req,res){
  try {
    const result=await query.getNotifications(req.user.userId);
    return res.status(200).json(result); 
  } catch (error) {
    console.log(error);
    return res.status(400).json({message: error})
  }
}

module.exports={signUpUser,getMessages,getNotifications,conversationRead, userConversations,createMessage, getFollowingPosts, unlikeComment,getRecentPosts,getSinglePost,commentPost,likeComment, unlikePost, likePost, getPostsByUserId, createPost, getPostReactions, loginUser, forgotPassword, resetPassword, followUser, checkToken, checkIfLogged, findUser, uploadFile, findUserData, unfollowUser}