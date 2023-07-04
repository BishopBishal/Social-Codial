const express = require('express');
const port = 8000;

const app = express();
app.use(express.urlencoded());

app.use('/',require('./routers/index'));







app.listen(port,function(err){
    if(err){
        console.log(`Error starting server and listening on ${port}`);
    }
    console.log(`Starting server on ${port}`);
});