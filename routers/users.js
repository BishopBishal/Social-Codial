const express = require('express');
const router = express.Router();
const passport = require('passport');


const usersController = require("../controllers/usersController");

router.get('/profile',passport.checkAuthentication,usersController.profile);

router.get('/signup',usersController.signup);

router.get('/signin',usersController.signin);

router.post('/create-user',usersController.createUser);

//use passport as a middleware for authentications
router.post('/create-session',passport.authenticate(
    'local',
    {failureRedirect:'/user/signin'}
),usersController.createSession);


router.get('/signout',usersController.signOut);

module.exports =router;