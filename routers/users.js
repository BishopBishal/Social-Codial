const express = require('express');
const router = express.Router();
const passport = require('passport');


const usersController = require("../controllers/usersController");

router.get('/profile/:id', passport.checkAuthentication, usersController.profile);

router.get('/signup', usersController.signup);

router.get('/signin', usersController.signin);

router.post('/create-user', usersController.createUser);

//use passport as a middleware for authentications
router.post('/create-session', passport.authenticate(
    'local',
    { failureRedirect: '/user/signin' }
), usersController.createSession);


router.get('/signout', usersController.signOut);

router.post('/update-user/:id', usersController.updateUser);


router.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
router.get('/auth/google/callback', passport.authenticate('google', { failureRedirect: '/user/signin' }), usersController.createSession);

//Forget Password
router.get('/forgetPassword', usersController.forgetPassword);
router.post('/confirmEmail', usersController.confirmEmail);
router.get('/resetPassword', usersController.resetPassword);
router.post('/changePassword', usersController.changePassword);

module.exports = router;