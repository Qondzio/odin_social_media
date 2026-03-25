const {Router}=require('express');
const route=Router();
const controller=require('../controllers/controller.js');
const validator=require('../controllers/validator.js');


route.post("/api/login", controller.loginUser);
route.post("/api/signup", validator.validateSignUp, controller.signUpUser);
route.post("/api/forgot-password", controller.forgotPassword);
route.post('/api/reset-password/:token', validator.validateNewPassword, controller.resetPassword);
route.get('/api/reset-token/:token', controller.checkToken);
route.get('/api/checkIfLogged', controller.checkIfLogged)
route.get("/api/log-out", (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    res.status(200).json('Looged out')
  });
});

module.exports=route;