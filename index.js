const express = require('express');
const cookieParser=require('cookie-parser');
const expressEjsLayouts = require('express-ejs-layouts');
const db =require('./configs/mongoose');

//used for session cookies
const session= require('express-session');
const passport = require('passport');
const passportLocal = require('./configs/passport-local-strategy');
const MongoStore = require('connect-mongo')(session);



const app = express();
const port = 8000;
app.use(express.urlencoded());
app.use(cookieParser());
app.use(expressEjsLayouts);
app.use(express.static('./assets'));

//Extract style and javascript from the subpages to the layouts
app.set('layout extractStyles',true);
app.set('layout extractScripts',true);


//session and passport middleware
//mongo store is used to store the session in the database

app.use(session({
    name: 'codial',
    // TO DO Later change this secret to something more secure
    secret: 'neverlosehope',
    saveUninitialized: false,
    resave: false,
    cookie: {
        maxAge: (1000 * 60 * 60)
    },
    store: new MongoStore({
        mongooseConnection: db,
        autoRemove: 'disabled'
    },
    function (err) {
        console.log(err || 'Cookies have been successfully stored in the database');
    })
}));


app.use(passport.initialize());
app.use(passport.session());
app.use(passport.setAuthenticatedUser);


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