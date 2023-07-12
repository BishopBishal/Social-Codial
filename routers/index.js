const express = require('express');
const router = express.Router();
const homeController = require('../controllers/homeController');


console.log('Routers are Loading...');  

router.get('/',homeController.home);
router.use('/user',require('./users'));
router.use('/post',require('./post'));


module.exports = router;