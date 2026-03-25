const passport=require('passport');
const bcrypt = require("bcryptjs");
const LocalStrategy = require('passport-local').Strategy;
const query=require('../../prisma/queries.js');


passport.use(
  new LocalStrategy(async (email, password, done) => {
    try {
            
      const user= await query.checkCredentials(email);      
      
      if (!user) {
        return done(null, false, { message: "Email is incorrect or does not exist" });
      }
      const match = await bcrypt.compare(password, user.password);

      if (!match) {
        return done(null, false, { message: "Password is incorrect" });
      }
      
      return done(null, user);
    } catch(err) {
      return done(err);
    }
  })
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await query.checkLoginId(id);

    done(null, user);
  } catch(err) {
    done(err);
  }
});


module.exports=passport;