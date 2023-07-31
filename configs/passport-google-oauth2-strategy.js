const passport = require('passport');
const googleStrategy = require('passport-google-oauth').OAuth2Strategy;
const crypto = require('crypto');
const User = require('../models/user');

//tell passport to use new strategy for google login
passport.use(new googleStrategy({
    clientID: "##",
    clientSecret: "##",
    callbackURL: "http://localhost:8000/user/auth/google/callback"
},

    async function (accessToken, refreshToken, profile, done) {
        try {

            console.log('Access token:- ', accessToken, '---- refresh token:- ', refreshToken);
            //find a User
            const oldUser = await User.findOne({ email: profile.emails[0].value }).exec();
            console.log('profile found - ', profile);

            if (oldUser) {
                //if the user found then the user as req.user
                console.log('user found - ', oldUser);
                return done(null, oldUser);
            }
            else {
                // if not found then create the new user and set it as req.user
                const newUser = await User.create({
                    name: profile.displayName,
                    email: profile.emails[0].value,
                    avatar: profile.photos[0].value,
                    password: crypto.randomBytes(20).toString('hex')
                });
                console.log('new user created - ', newUser);
                return done(null, newUser);
            }
        } catch (e) {
            console.log("Error in google passport strategy: ", e);
            return done(e);
        }


    }

));


module.exports = passport;