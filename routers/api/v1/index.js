const express = require('express');
const router = express.Router();

//console.log('v1 routers are available');

router.use('/posts', require('./posts'));
router.use('/users', require('./users'));

module.exports = router;