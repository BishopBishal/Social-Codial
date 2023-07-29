const express = require('express');
const router = express.Router();
const postsApi = require('../../../controllers/api/v1/post_api')
const passport = require('passport');
// console.log('posts  routers are available');

router.get('/', postsApi.findAllPost);

router.delete('/:id', passport.authenticate('jwt', { session: false }), postsApi.deletePost);




module.exports = router;