const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/user');
const Post = require('../models/post');

//Authentication using passport
passport.use(new LocalStrategy(
    {
        usernameField:'email'
    },
    async function(email,password,done) {
       try {
        //finding the user and stablish its identity
            const user = await User.findOne({email: email});
            console.log('user found', user,password);
             if(!user || user.password != password) {
                console.log('Invalid password');
                return done(null,false);
            } 
            return done(null,user);
        }
        catch (err) {
            console.error('Error finding is user --> Passport',err);
            return done(err);
        }
    }
));

//serializing the user to decide which key to use in cookies
passport.serializeUser(function(user,done) {
    done(null,user.id);
});


//deserializing the user from the key in the cookie
passport.deserializeUser(async function(id,done){
    try
    {
        const user = await User.findById(id);
        console.log('user found',user);
        return done(null,user);
    }
    catch (err) {
            console.error('Error finding is user --> Passport',err);
            return done(err); 
    }
});

//check if user is Authenticated
passport.checkAuthentication= function(req,res,next)
{
        if(req.isAuthenticated())
        {
            return next();
        }
        return res.redirect('/user/signin');
}

passport.setAuthenticatedUser= function(req,res,next)
{
    if(req.isAuthenticated())
    {
        //req contain the current user from the session cookie and we are just sending this to the local for the views
        res.locals.user = req.user;
        
    }
    next();
}

module.exports=passport;