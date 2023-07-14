const passport = require("passport");
const User =require("../models/user");
module.exports.profile=function(req, res){
    return res.render('userProfile',{title : 'ProfilePage'});
};


module.exports.signup=function(req, res){
    if(req.isAuthenticated())
    {
        return res.redirect('/user/profile');
    }
    return res.render('userSignup',{title : 'Codial | Signup Page'});
};

module.exports.signin=function(req, res){
    if(req.isAuthenticated())
    {
        return res.redirect('/user/profile');
    }
    return res.render('userSignin',{title : 'Codial | Signin Page'});
};

module.exports.createUser=async function(req, res){
    try{
        if(req.body.email != req.body.confirmEmail)
        {
            console.log('Confirmation email does not match with email',req.body);   
            return res.redirect('back');
        }
   
    
        const newUser=await User.findOne({email : req.body.email});
        if(newUser == null)
        {
            const newCreatedUser=await User.create(req.body);
            console.log('Created user',newCreatedUser);
                return res.redirect('/user/signin');
        }
        else{
            console.log('Duplicate Entry... You can make only one user with one emailId !!!');
            return res.redirect('back');
        }
    }
    catch(err)
    {
        return  res.status(500).send("Internal Server Error",err);
    }
};

module.exports.createSession=function(req, res){
    console.log('createSession',req.body);
    return res.redirect('/user/profile');
};

module.exports.signOut=function(req, res){
    req.logout(function(err){
        if(err)
        {
            console.log('error happened while signing out',err);
            return ;
        }
        console.log("successfully logout");
    });
    return res.redirect('/user/signin');
};

