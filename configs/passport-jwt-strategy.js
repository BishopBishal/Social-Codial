const passport = require('passport');
const JWTStrategy = require('passport-jwt').Strategy;
const ExtractJWT = require('passport-jwt').ExtractJwt;

const User = require('../models/user');

let opts = {
    jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
    secretOrKey: 'neverlosehope'
}

passport.use(new JWTStrategy(opts, async function (jwtPayload, done) {
    try {
        let foundUser = await User.findById(jwtPayload._id);

        if (foundUser) {
            return done(null, foundUser);
        }
        else {
            return done(null, false);
        }


    } catch (e) {
        console.log('Error in finding user from jwt', err);
        return;
    }
}));



module.exports = passport;