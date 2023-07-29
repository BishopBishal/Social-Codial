const express = require('express');
const router = express.Router();

//console.log('Api routers are available');

router.use('/v1', require('./v1'));



module.exports = router;