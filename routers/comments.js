const express = require('express');
const router = express.Router();
const passport = require('passport');
const commentController = require('../controllers/commentController');

router.post('/create-comment',passport.checkAuthentication,commentController.createComment);


module.exports =router;