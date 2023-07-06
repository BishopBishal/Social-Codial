const express = require('express');
const cookieParser=require('cookie-parser');
const expressEjsLayouts = require('express-ejs-layouts');
const db =require('./configs/mongoose');
const port = 8000;



const app = express();
app.use(express.urlencoded());
app.use(cookieParser());
app.use(expressEjsLayouts);
app.use(express.static('./assets'));

//Extract style and javascript from the subpages to the layouts
app.set('layout extractStyles',true);
app.set('layout extractScripts',true);


//settup express routers    
app.use('/',require('./routers/index'));

//setup express views engine
app.set('view engine','ejs');
app.set('views' ,'./views');








app.listen(port,function(err){
    if(err){
        console.log(`Error starting server and listening on ${port}`);
    }
    console.log(`Starting server on ${port}`);
});