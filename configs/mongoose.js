const mongoose = require('mongoose');

mongoose.connect('mongodb://127.0.0.1/codial_development');

const db =mongoose.connection;

db.on('error',console.error.bind(console,"Error connecting to MongoDB"));

db.once('open',function(){
    console.log("Succeeded to connect to MongoDB");
});

module.exports=db;