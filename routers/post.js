const express = require('express');
const router = express.Router();
const passport = require('passport');
const postController = require('../controllers/postControllers');

router.post('/create-post',passport.checkAuthentication,postController.createPost);
router.get('/delete-post/:id',passport.checkAuthentication,postController.destroyPost);

module.exports =router;