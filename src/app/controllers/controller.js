const query=require('../../../prisma/queries.js');
const bcrypt = require("bcryptjs");
const passport=require('../passport.js');
const mailer=require('./mailer.js');
const { validationResult, matchedData } = require("express-validator");
const crypto = require('crypto');

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
  console.log(req.user);
  
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
  
  if(req.user){
    return res.status(200).json({message: req.user});
  }
  else{
    return res.status(401).json();
  }
}

module.exports={signUpUser, loginUser, forgotPassword, resetPassword, checkToken, checkIfLogged}