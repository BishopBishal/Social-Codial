const express = require('express');
const router = express.Router();
const passport = require('passport');
const postController = require('../controllers/postControllers');

router.post('/create-post',postController.createUser);


module.exports =router;