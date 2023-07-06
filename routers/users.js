const express = require('express');
const router = express.Router();



const usersController = require("../controllers/usersController");

router.get('/profile',usersController.profile);

router.get('/signup',usersController.signup);

router.get('/signin',usersController.signin);

router.post('/create-user',usersController.createUser);

router.post('/create-session',usersController.createSession);


module.exports =router;